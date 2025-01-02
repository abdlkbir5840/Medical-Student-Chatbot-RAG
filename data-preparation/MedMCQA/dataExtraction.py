from datasets import load_dataset
import pandas as pd

#Loading the corpusfrom HF
ds = load_dataset("openlifescienceai/medmcqa")

# Extracting the training split
train_data = ds['train']

#Creating our Q/A corpus
def convert_to_qa(row):
    # Getting the question
    question = row['question']
    # Getting the correct option key: convert number to letter, lowercase it
    correct_option_key = 'op' + chr(ord('a') + row["cop"] - 1)  # Convert number to letter, assuming 1-based indexing for 'cop'
    
    # Handling KeyError using get() with a default value
    correct_option = row.get(correct_option_key, "Option not found")  # If key not found, use "Option not found"
    
    explanation = row['exp']
    
    # Returning Q/A format
    return {
        'question': question,
        'answer': correct_option,
        'explanation': explanation
    }

# Converting the training dataset to Q/A format
qa_data = train_data.map(convert_to_qa)

# Converting to a Pandas DataFrame for easier manipulation/export
qa_df = pd.DataFrame(qa_data)

# Combining the 'answer' and 'explanation' columns into a new column 'answer_explained'
qa_df['answer_explained'] = qa_df['answer'] + " " + qa_df['explanation']

# Keeping only the 'question' and 'answer_explained' columns
qa_df_features = qa_df[['question', 'answer_explained']]


#Adding a new coloumn called 'label' to assess ifthe retrieved answer is in-context or out-of-context
qa_df_features['label'] = 1


# Saving to a CSV file
qa_df_features.to_csv("medmcqa_train_qa_filtered.csv", index=False)