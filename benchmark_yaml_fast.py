import os
import sys
import time

sys.path.append(os.getcwd())
from app import fast_yaml_load
from utils.yaml_converter import json_to_yaml_structure

# Create dummy yaml data
data = {
    "template": "modern-with-icons",
    "contact_info": {"name": "John Doe", "email": "john@example.com"},
    "sections": [
        {
            "name": f"Section {i}",
            "type": "experience",
            "content": [{"title": "A", "description": "B" * 100}],
        }
        for i in range(100)
    ],
}

import yaml

yaml_string = yaml.dump(data)

# Test fast_yaml_load
start = time.time()
for _ in range(1000):
    fast_yaml_load(yaml_string)
fast_time = time.time() - start

print(f"Fast load (from app): {fast_time:.4f}s")
