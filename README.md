# Unique Integer Processor Overview

The `unique-int-processor.py` script processes text files containing integers from a specified input directory. It extracts unique integers, sorts them, and writes the sorted integers to a specified output directory. This document provides instructions on setting up the directory structure, configuring the script, running it, and troubleshooting common issues.

## Directory Structure

Ensure your project directory is structured as follows:

```css
/dsa
└── hw01
├── code
│   └── src
│       └── unique-int-processor.py
├── sample_inputs
└── sample_results
```

- `unique-int-processor.py`: The Python script that processes integers.
- `sample_inputs/`: Directory where input text files with integers are stored (one integer per line).
- `sample_results/`: Directory where the processed and sorted results will be saved. This directory will be created automatically if it does not exist.

## Script Details

### Description

- `process_line(line)`: Processes each line from the input file to extract integers.
- `is_valid_integer(line)`: Checks if a line contains a valid integer.
- `quick_sort(arr)`: Custom Quick Sort implementation to sort integers.
- `process_file(input_file, output_file)`: Reads integers from `input_file`, processes them, sorts them, and writes the sorted integers to `output_file`.
- `process_directory(input_directory, output_directory)`: Processes all files in the `input_directory` and saves the results to `output_directory`.

### Main Function

The `main()` function performs the following tasks:
1. Defines the paths for input and output directories.
2. Ensures that the directories exist or creates them if necessary.
3. Calls the `process_directory` method to process all files in the input directory.

## Prerequisites

- Python 3.x installed on your system.

## Setup Instructions

1. Create the Directory Structure:
   Create the necessary directories and place the `unique-int-processor.py` script in the `src` folder.

   ```bash
   mkdir -p dsa/hw01/code/src/sample_inputs
   mkdir -p dsa/hw01/code/src/sample_results
   ```

2. Place Input Files:
   Add your text files containing integers (one per line) to the `sample_inputs/` directory.

3. Verify Permissions:
   Ensure you have read permissions for the `sample_inputs/` directory and write permissions for the `sample_results/` directory.

## Running the Script

1. Navigate to the Script Directory:
   Change your working directory to where the script is located:

   ```bash
   cd dsa/hw01/code/src/
   ```

2. Run the Script:
   Execute the script using Python 3:

   ```bash
   python3 unique-int-processor.py
   ```

## Troubleshooting Common Issues

- **FileNotFoundError**: If you encounter this error, ensure that the `sample_inputs/` directory exists and contains input files. Verify the paths in the script to ensure they are correct.

- **PermissionError**: If the script fails due to permissions issues, make sure you have the necessary read/write permissions for the input and output directories.

- **Directory Creation Errors**: If the script fails to create the `sample_results/` directory, check your write permissions for the parent directories.

- **Debugging Print Statements**: The script includes debug print statements to show the directories being used. Check these outputs to confirm that the paths are correct.

- **Path Validations**: Ensure that paths are correctly constructed relative to the script's location.

## Example

Given the following input file in `sample_inputs/` (e.g., `numbers.txt`):

```
5
2
8
5
3
```

After running the script, the output file in `sample_results/` (e.g., `numbers.txt`) will contain:

```
2
3
5
8
```

## License

This script is provided "as-is" without any warranty. You are free to modify and distribute it as needed.
```