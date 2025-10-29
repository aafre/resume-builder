import os
import yaml
from flask import Flask, request, jsonify, send_from_directory, render_template
from flask_cors import CORS
from werkzeug.utils import secure_filename
from resume_generator import generate_resume_from_yaml
from resume_generator_for_latex import generate_resume_from_yaml_latex

app = Flask(__name__, static_folder="static", template_folder="templates")
CORS(app)

UPLOAD_FOLDER = "uploads"
ALLOWED_EXTENSIONS = {"yml", "yaml"}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# ✅ Default Section Length Limits
DEFAULT_MAX_LENGTHS = {
    "about_me": 500,
    "education": 1000,
    "experience": 2000,
    "projects": 1500,
    "skills": 300,
    "certifications": 800,
    "contact_info": 300,
}


# ✅ Add maxLength property to template YAML before sending to UI
def apply_max_length(yaml_content):
    for section, max_len in DEFAULT_MAX_LENGTHS.items():
        if section in yaml_content:
            if isinstance(yaml_content[section], dict):
                yaml_content[section]["maxLength"] = yaml_content[section].get("maxLength", max_len)
    return yaml_content


# ✅ Add flexible validation rules for future API endpoint (Issue #106)
RECOMMENDED_LENGTHS = {
    "by_name": {
        "Summary": 1000,
        "Professional Profile": 1000,
    },
    "by_type": {
        "text": 1500,
        "bulleted-list": 250,
        "inline-list": 50,
        "experience.description": 1200,
    }
}


# ✅ Core Validation Helper (No API yet — reused in future tasks)
def validate_section_lengths(data, config):
    warnings = []

    for section in data.get("sections", []):
        name = section.get("name", "")
        content_type = section.get("type", "")
        content = section.get("content", "")

        # 1️⃣ Check by exact section name override
        if name in config["by_name"]:
            max_len = config["by_name"][name]
            if len(content) > max_len:
                warnings.append({"section": name, "message": f"Exceeds recommended length of {max_len} chars"})
            continue

        # 2️⃣ Fallback to type-based rules
        if content_type in config["by_type"]:
            max_len = config["by_type"][content_type]

            if isinstance(content, list):
                for i, item in enumerate(content):
                    if len(item) > max_len:
                        warnings.append({
                            "section": name,
                            "item": i,
                            "message": f"Item exceeds limit of {max_len} chars",
                        })
            elif isinstance(content, str) and len(content) > max_len:
                warnings.append({"section": name, "message": f"Exceeds recommended length of {max_len} chars"})

    return warnings


# ✅ Serve the UI
@app.route("/")
def home():
    return render_template("index.html")


# ✅ Template fetch API — returns YAML + maxLength
@app.route("/api/template/<template_id>", methods=["GET"])
def get_template(template_id):
    template_path = os.path.join("samples", f"{template_id}.yml")

    if not os.path.exists(template_path):
        return jsonify({"error": "Template not found"}), 404

    with open(template_path, "r") as file:
        yaml_content = yaml.safe_load(file)

    yaml_content = apply_max_length(yaml_content)  # ✅ ADD THIS LINE

    return jsonify(yaml_content)


# ✅ File upload API — unchanged
@app.route("/api/upload-yaml", methods=["POST"])
def upload_yaml():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    filename = secure_filename(file.filename)
    upload_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(upload_path)

    with open(upload_path, "r") as f:
        yaml_content = yaml.safe_load(f)

    return jsonify(yaml_content)


# ✅ Resume Generation API (unchanged)
@app.route("/api/generate-resume", methods=["POST"])
def generate_resume():
    data = request.json
    format_type = data.get("format", "html")
    yaml_data = data.get("yamlData")

    if not yaml_data:
        return jsonify({"error": "No YAML data provided"}), 400

    if format_type == "latex":
        output_path = generate_resume_from_yaml_latex(yaml_data)
    else:
        output_path = generate_resume_from_yaml(yaml_data)

    return jsonify({"url": output_path})


@app.route("/static/<path:filename>")
def serve_static(filename):
    return send_from_directory("static", filename)


if __name__ == "__main__":
    app.run(debug=True)
