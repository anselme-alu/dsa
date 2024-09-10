import os
import sys

class DistinctIntegerHandler:
    def handle_line(self, line_content):
        """Process a single line from the input file."""
        candidate_numbers = line_content.split()
        approved_numbers = []
        for entry in candidate_numbers:
            if self.is_integer(entry):
                number = int(entry)
                if -1023 <= number <= 1023:
                    approved_numbers.append(number)
        return approved_numbers

    def is_integer(self, entry):
        """Check if the entry is a valid integer."""
        try:
            int(entry)
            return True
        except ValueError:
            return False

    def merge_sort(self, data_list):
        """Custom implementation of Merge Sort."""
        if len(data_list) <= 1:
            return data_list
        
        def merge(left, right):
            sorted_list = []
            while left and right:
                if left[0] < right[0]:
                    sorted_list.append(left.pop(0))
                else:
                    sorted_list.append(right.pop(0))
            sorted_list.extend(left or right)
            return sorted_list

        mid = len(data_list) // 2
        left_half = self.merge_sort(data_list[:mid])
        right_half = self.merge_sort(data_list[mid:])
        
        return merge(left_half, right_half)

    def handle_file(self, input_filepath, output_filepath):
        """Main method to read the file, process integers, and write the sorted unique output."""
        if not os.path.exists(input_filepath):
            print(f"Input file '{input_filepath}' does not exist.")
            return
        
        unique_numbers = set()
        
        # Add _results.txt to the output file
        result_filepath = output_filepath + "_results.txt"

        # Read the input file and process each line
        with open(input_filepath, 'r') as infile:
            for line in infile:
                approved_numbers = self.handle_line(line)
                unique_numbers.update(approved_numbers)

        # Sort the unique numbers using Merge Sort
        sorted_unique_numbers = self.merge_sort(list(unique_numbers))

        # Write the sorted unique numbers to the output file
        with open(result_filepath, 'w') as outfile:
            for number in sorted_unique_numbers:
                outfile.write(f"{number}\n")

        print(f"Processed: {input_filepath} -> {result_filepath}")
    
    def handle_directory(self, input_dir, output_dir):
        """Process all files in the input directory."""
        for file_name in os.listdir(input_dir):
            if file_name.endswith('.txt'):
                input_filepath = os.path.join(input_dir, file_name)
                output_filepath = os.path.join(output_dir, file_name)
                self.handle_file(input_filepath, output_filepath)

# Main function to handle command-line arguments and initiate file processing
def main():
    # Get the directory of the script
    script_directory = os.path.dirname(os.path.abspath(__file__))
    
    # Define relative paths
    input_dir = os.path.join(script_directory, '../../sample_inputs/')
    output_dir = os.path.join(script_directory, '../../sample_results/')

    # Convert to absolute paths
    input_dir = os.path.abspath(input_dir)
    output_dir = os.path.abspath(output_dir)

    # Debug information
    print(f"Input Directory: {input_dir}")
    print(f"Output Directory: {output_dir}")

    if not os.path.exists(input_dir):
        print(f"Error: The input directory '{input_dir}' does not exist.")
        sys.exit(1)  # Exit with error code

    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    handler = DistinctIntegerHandler()
    handler.handle_directory(input_dir, output_dir)

# Entry point for the script
if __name__ == "__main__":
    main()
