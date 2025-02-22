import yaml


def calculate_columns(num_items, max_columns=4, min_items_per_column=2):
    """
    Dynamically calculate the number of columns and ensure a minimum number of items per column.

    This function computes the number of columns by attempting to distribute the given
    number of items evenly. If the total number of items is less than or equal to the minimum
    required per column, it defaults to a single column. Otherwise, it increases the number of columns
    until the average items per column drops below the specified minimum, then returns one less column
    than the current iteration.

    Args:
        num_items (int): The total number of items.
        max_columns (int): The maximum number of columns to allow. Must be >= 1.
        min_items_per_column (int): The minimum number of items per column to justify adding another column.

    Returns:
        int: The calculated number of columns.

    Raises:
        ValueError: If max_columns is less than 1.
    """
    if num_items <= min_items_per_column:
        return 1  # Single column if items are too few

    for cols in range(2, max_columns + 1):
        avg_items_per_col = num_items / cols
        if avg_items_per_col < min_items_per_column:
            return cols - 1

    return max_columns  # Default to max columns if all checks pass


def get_social_media_handle(url):
    """
    Extract social media handle from URL.

    Args:
        url (str): The social media URL.

    Returns:
        str: The social media handle.
    """
    if url:
        return url.split("/")[-1]
    return ""


# Load data from YAML
def load_resume_data(file_path):
    print("Loading resume data...")
    with open(file_path, "r") as file:
        try:
            data = yaml.safe_load(file)
            if not isinstance(data, dict):
                raise ValueError("Invalid resume data: expected a mapping (dict)")
            return data
        except yaml.YAMLError as e:
            raise ValueError(f"Error parsing YAML file: {e}")
