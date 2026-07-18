import yaml
import time
import json
import random
import string

try:
    from yaml import CSafeDumper as SafeDumper
except ImportError:
    from yaml import SafeDumper

def generate_random_string(length):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

def generate_complex_dict(depth=3, max_keys=5):
    if depth == 0:
        return generate_random_string(20)

    return {
        generate_random_string(10): generate_complex_dict(depth - 1, max_keys)
        for _ in range(random.randint(2, max_keys))
    }

data = [generate_complex_dict() for _ in range(10)]

start = time.time()
for _ in range(100):
    yaml.dump(data, default_flow_style=False, allow_unicode=True, sort_keys=False, width=float('inf'))
slow_time = time.time() - start

start = time.time()
for _ in range(100):
    yaml.dump(data, Dumper=SafeDumper, default_flow_style=False, allow_unicode=True, sort_keys=False, width=int(1e9))
fast_time = time.time() - start

print(f"Slow (default): {slow_time:.4f}s")
print(f"Fast (CSafeDumper): {fast_time:.4f}s")
print(f"Speedup: {slow_time / fast_time:.2f}x")
