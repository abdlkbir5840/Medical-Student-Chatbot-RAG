import os
import json

def process_json_file(file_path):
    all_extracted_data = []
    
    try:
        with open(file_path, 'r') as file:
            data = json.load(file)
            
            print(f"Processing file: {file_path}")
            print(f"Top-level keys: {list(data.keys())}")

            if 'data' in data:
                for item in data['data']:
                    if 'paragraphs' in item:
                        for paragraph in item['paragraphs']:
                            if 'qas' in paragraph:
                                for qa in paragraph['qas']:
                                    question = qa.get('question', 'No question')
                                    ideal_answer = " ".join([answer['text'] for answer in qa.get('answers', [])]) 

                                    all_extracted_data.append({
                                        'question': question,
                                        'answer': ideal_answer,
                                        'label': 1 
                                    })
            else:
                print(f"Skipping {file_path}, 'data' key not found.")
    except Exception as e:
        print(f"Error reading file {file_path}: {e}")

    return all_extracted_data

directory = './BioASQContext'

all_extracted_data = []
for filename in os.listdir(directory):
    if filename.endswith(".json"):
        file_path = os.path.join(directory, filename)
        data = process_json_file(file_path)
        all_extracted_data.extend(data)

output_directory = './json-data'
os.makedirs(output_directory, exist_ok=True)

output_file_path = os.path.join(output_directory, 'BioASQContext.json')
with open(output_file_path, 'w') as outfile:
    json.dump(all_extracted_data, outfile, indent=4)

print(f"Data has been saved to {output_file_path}")
