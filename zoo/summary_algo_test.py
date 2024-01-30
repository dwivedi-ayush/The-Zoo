# from chatlogs_test import test1, test2, test3, test4, test5

# from summarizer import Summarizer
# from transformers import BertTokenizer, BertModel
# from transformers import pipeline
from dotenv import load_dotenv, find_dotenv
import openai as ai
import os

# from gensim.summarization import summarize


# def BERTsum(orignal_txt):
#     def generate_summary_bert(original_text):
#         tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")
#         model = BertModel.from_pretrained("bert-base-uncased")

#         inputs = tokenizer(
#             original_text, return_tensors="pt", max_length=512, truncation=True
#         )
#         outputs = model(**inputs)

#         summary_tokens = tokenizer.decode(
#             inputs["input_ids"].squeeze()[:50].tolist()
#         )  # Adjust the number of tokens for the summary

#         return summary_tokens

#     long_text = orignal_txt

#     # Generate summary
#     summary_text = generate_summary_bert(long_text)

#     print("\nSummary from BERT:")
#     print(summary_text)
#     return


# def transformers(orignal_txt):
#     def generate_summary_t5(original_text):
#         summarizer = pipeline("summarization", model="t5-base", tokenizer="t5-base")
#         summary = summarizer(
#             original_text,
#             max_length=2048,
#             min_length=50,
#             length_penalty=2.0,
#             num_beams=4,
#         )
#         return summary[0]["summary_text"]

#     long_text = orignal_txt

#     # Generate summary
#     summary_text = generate_summary_t5(long_text)

#     print("\nSummary from transformers:")
#     print(summary_text)
#     return


# def gensim(orignal_txt):
#     def generate_summary_gensim(original_text):
#         summary = summarize(original_text, ratio=0.2)
#         return summary
#     long_text = orignal_txt

#     # Generate summary
#     summary_text = generate_summary_gensim(long_text)

#     print("\nSummary from BERT:")
#     print(summary_text)
#     return


def openAI_summariser(orignal_txt):
    load_dotenv(find_dotenv())

    client = ai.OpenAI(api_key=os.getenv("API_KEY"))
    prompt = "Given is a set of tweet made by someone, summarize these tweets in short,tweets are:  The summary should capture the main points and key details of the text while conveying the author's intended meaning accurately. Please ensure that the summary is well-organized and easy to read, with clear headings and subheadings to guide the reader through each section. The length of the summary should be appropriate to capture the main points and key details of the text, without including unnecessary information or becoming overly long:"

    response = client.completions.create(
        model="gpt-3.5-turbo-instruct",
        prompt=prompt + orignal_txt,
        temperature=0.8,
        max_tokens=300,
    )
    # print("openAI summary:")
    # print(response.choices[0].text)
    return response.choices[0].text


# BERTsum(test1)
# transformers(test1)
# gensim(test1)

a = """
============================================================================================================
newtweet;Just finished training with #TheJusticeLeague, feeling pumped! Stay vigilant and stay safe, citizens. #MondayMotivation #JusticeLeague #BatFam
end
============================================================================================================

newtweet; It's a sunny Monday afternoon and I'm feeling great! My BIG FIVE personality scores are Medium in openness, consciousness, and agreeableness, with a low extraversion and medium neuroticism. #Batman #personality #MondayMood
end
============================================================================================================
Newtweet; Just wrapped up a mission to stop the Joker from stealing every diamond in Gotham. Feeling satisfied with my work for today. #capedsaviour #darkknight #victory
end
============================================================================================================

newtweet; Just finished my morning run and feeling energized for the day ahead. Remember, it's important to take care of your physical health, especially during these challenging times. Stay active and stay safe. #MondayMotivation #FitForJustice
end
============================================================================================================

newtweet; It's 4 PM and it's already 20°C on a Monday. A clear, sunny winter day. Time to go out and save the city! The bat signal may not be needed, but I'm always ready. #batman #hero #sunnywinterday
end
"""
openAI_summariser(a)


###
# Summary from BERT:
# the goal behind contrastive loss is to train a model to distinguish between two different sets of data, such as positive and negative examples . in contrastive learning, the goal is to learn a representation of the data that captures the underlying structure . the best approach will depend on the specific characteristics of your dataset and the goals of your model .


# Summary from BERT:
# [CLS] ( [ { " user " : " anonymous ", " message " : " what is contrastive loss? " }, { " user " : " chat gpt ", " message " : " contrastive loss is a type of loss

# openAI summary:
# Contrastive loss is a measure of the difference between two sets of data commonly used in machine learning, particularly in computer vision. It is used to train deep learning models to learn discriminative and meaningful representations. Labels are not necessary for contrastive learning, as the goal is to capture the underlying structure of the data. Prior knowledge about the data is needed to sample positive and negative examples. The best approach for sampling in contrastive learning will depend on the characteristics of the dataset and the model's goals. Triplet loss and contrastive loss are two types of loss functions used in machine learning. They differ in the way they measure the difference between sets of data, with triplet loss focusing on comparing examples from different classes and contrastive loss focusing on capturing the underlying structure. The choice between the two will depend on the dataset and model's goals.
###
