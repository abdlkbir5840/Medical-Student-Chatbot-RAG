import os
import json

def process_json_file(file_path):
    all_extracted_data = []
    
    try:
        with open(file_path, 'r') as file:
            data = json.load(file)
            
            print(f"Processing file: {file_path}")
            print(f"Top-level keys: {list(data.keys())}")

            if 'questions' in data:
                for question in data['questions']:
                    question_body = question.get('body', 'No question body')
                    ideal_answer = " ".join(question.get('ideal_answer', []))
                    label = 1 

                    all_extracted_data.append({
                        'question': question_body,
                        'answer': ideal_answer,
                        'label': label
                    })
            else:
                print(f"Skipping {file_path}, 'questions' key not found.")
    except Exception as e:
        print(f"Error reading file {file_path}: {e}")

    return all_extracted_data

directory = './BioASQ'

all_extracted_data = []
for filename in os.listdir(directory):
    if filename.endswith(".json"):
        file_path = os.path.join(directory, filename)
        data = process_json_file(file_path)
        all_extracted_data.extend(data)

output_directory = './json-data'
os.makedirs(output_directory, exist_ok=True)

output_file_path = os.path.join(output_directory, 'BioASQ.json')
with open(output_file_path, 'w') as outfile:
    json.dump(all_extracted_data, outfile, indent=4)

print(f"Data has been saved to {output_file_path}")
