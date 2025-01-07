import json

def decode_json_file(input_file, output_file):
    """
    Reads a JSON file, decodes Unicode in the 'text' field of each entry, 
    and saves the decoded JSON to a new file.
    
    Args:
        input_file (str): Path to the input JSON file.
        output_file (str): Path to save the decoded JSON file.
    """
    # Load the JSON data from the input file
    with open(input_file, 'r', encoding='utf-8') as file:
        data = json.load(file)
    
    # Decode Unicode in each 'text' field
    for entry in data:
        if 'text' in entry:
            entry['text'] = entry['text'].encode().decode('unicode_escape')
    
    # Save the decoded data to the output file
    with open(output_file, 'w', encoding='utf-8') as file:
        json.dump(data, file, indent=4, ensure_ascii=False)

# Example usage
input_file_path = "./rag-data/rag-chunks-unicode.json"  # Replace with your input file path
output_file_path = "./rag-data/decoded_output.json"  # Replace with your desired output file path

decode_json_file(input_file_path, output_file_path)
print(f"Decoded JSON saved to {output_file_path}")
