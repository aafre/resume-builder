import time

import yaml

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

yaml_string = yaml.dump(data)

# Test safe_load
start = time.time()
for _ in range(1000):
    yaml.safe_load(yaml_string)
safe_time = time.time() - start

# Test CSafeLoader
try:
    from yaml import CSafeLoader as SafeLoader
except ImportError:
    from yaml import SafeLoader

start = time.time()
for _ in range(1000):
    yaml.load(yaml_string, Loader=SafeLoader)
fast_time = time.time() - start

print(f"Safe load: {safe_time:.4f}s")
print(f"Fast load: {fast_time:.4f}s")
print(f"Speedup: {safe_time / fast_time:.2f}x")
