import os
import json

def combine_json_files(directory):
    all_combined_data = []
    
    for filename in os.listdir(directory):
        if filename.endswith(".json"):
            file_path = os.path.join(directory, filename)
            
            try:
                with open(file_path, 'r') as file:
                    data = json.load(file)
                    all_combined_data.extend(data) 
                    print(f"Successfully added data from {filename}")
            except Exception as e:
                print(f"Error reading file {file_path}: {e}")
    
    return all_combined_data

directory = './json-data'

combined_data = combine_json_files(directory)

output_directory = './json-data'
os.makedirs(output_directory, exist_ok=True)

output_file_path = os.path.join(output_directory, 'combined_data.json')
with open(output_file_path, 'w') as outfile:
    json.dump(combined_data, outfile, indent=4)

print(f"Data has been combined and saved to {output_file_path}")
