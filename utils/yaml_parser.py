import yaml


def fast_safe_load(stream):
    """
    Performance-optimized YAML loader.
    Attempts to use the C-based CSafeLoader which is ~8-10x faster for large files,
    falling back to the standard Python SafeLoader if C extensions aren't available.
    """
    try:
        return yaml.load(stream, Loader=yaml.CSafeLoader)
    except AttributeError:
        # Fallback if pyyaml wasn't compiled with libyaml support
        return yaml.load(stream, Loader=yaml.SafeLoader)
