import os
import tempfile
import time

from app import app
from utils.yaml_converter import json_to_yaml_structure


def measure_speed():
    test_yaml = """
template: modern-with-icons
contact_info:
  name: John Doe
  email: john@example.com
sections:
  - type: summary
    content: "Test summary"
"""

    # Measure yaml.safe_load directly
    import yaml

    start = time.perf_counter()
    for _ in range(1000):
        yaml.safe_load(test_yaml)
    safe_time = time.perf_counter() - start
    print(f"yaml.safe_load: {safe_time:.4f}s")

    try:
        from yaml import CSafeLoader

        start = time.perf_counter()
        for _ in range(1000):
            yaml.load(test_yaml, Loader=CSafeLoader)
        csafe_time = time.perf_counter() - start
        print(f"CSafeLoader: {csafe_time:.4f}s")
    except ImportError:
        print("CSafeLoader not available")


measure_speed()
