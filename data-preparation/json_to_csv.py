import json
import csv

def json_to_csv(json_data, output_file):
    fieldnames = ['question', 'answer', 'label']
    
    with open(output_file, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        
        for item in json_data:
            writer.writerow({
                'question': item.get('question', ''),
                'answer': item.get('answer', ''),
                'label': item.get('label', '')
            })

input_json_file = './json-data/combined_data.json'

with open(input_json_file, 'r', encoding='utf-8') as jsonfile:
    json_data = json.load(jsonfile)

output_csv_file = './csv-data/data.csv'

json_to_csv(json_data, output_csv_file)

print(f"CSV file has been saved to {output_csv_file}")
