
## Expectations

     End-to-end ML solution:
        * Data Cleaning
        * Feature Engineering
        * Train/Test Sampling
        * Normalization (if needed)
        * Training
        * Evaluation
        * Results Presentation
        * Bonus: Propose a deployment strategy for the model
        

## Ideally
  - 'sub_area' would be further transformed if there were more datapoitns, half of the less popular areas them would be converted to "other"
  - More data is a priority for better prediction, but do not want to use data synthesis (SMOTE, ADASYN) because it is not really reliable. Besides, boosting algorithms (XGB) use ensemble techniques that are resilient to class imbalances
  - With real time data, engineering features that are a function of price (currently commented) can be a good determinant of price
  - Use dask / polars / pyspark for big data instead of pandas
  - Remove many more outliers based on 'sub_area' would increase our prediction accuracy. But for now, that would significantly reduce the dataset size which is not ideal.
  - With a big enough data, modeling predictions for each sub-area individually would provide a much better solution



## Data Versions
    original_data : initial, unclean dataset
    cleaned_data : after data cleaning function
    outlier_na_free : removed outliers and null columns/samples
    featured_data : data after feature engineering



## Diving into the code
### Data Cleaning

There were a lot of tiny inconsistencies with the data. Since the dataset is very, very small, it is of grave importance to clean every single datapoint to minimize the number of samples dropped. 

  * trailing spaces

  * inconsistent spacing

  * inconsistent typecase

  * "property_type": converted the below values to a single number  
      - 2bhk  
      - 3 BHK Grand  
      - shop  
      - 2+2 bhk  
      - 3+2bhk  
      - bhk, BHK

  * "property_area_sq_ft": converted the below values to a single number  
      - 1600 +  
      - 1181, 1364  
      - 1070 to 1200  

  * "price_in_lakhs"
      - string "NULL" -> np.NaN

  * Renamed columns with best practise rules

  * Dropped the following columns  
      - ['sr_no', 'location', 'price_in_millions']  
      - dropped null rows



### Feature Engineering

  * Added in a ZIP code column, but has a very low -ve correlation with price (-0.094)
      ![Alt text](image.png)

  * However, zipcode binned has a comparatively higher positive correlation with price (0.035)

  * Created amenity columns and converted to boolean  
      ['clubhouse', 'school_university_in_township', 'hospital_in_township', 'mall_in_township', 'park_jogging_track', 'swimming_pool', 'gym']

  * Cleaning "description"
      - Tried TF-IDF, NER (slightly irrelevant) and Summarizer from huggingface (facebook/bart-large-cnn)  
      - None were as effective as good ol' **NLTK Tokenization, Stop Word Removal, and Lemmatization**  
      - Never had a stable relationship with Spacy, always throws some dependency error out, so chose to spend time on other better alternatives

  * Created a scoring column
      - checked for the existance of certain words that I thought were important to defend the pricing of a listing, and - converted that to a score which would be used in one of the prediction models to follow

  * Class Encoding
      - Considerations: Label, One-Hot, Target Encoding
      - Choosing Target Encoding because:
          - It handles high cardinality well
          - It captures the relationship between categories and price
          - It produces meaningful numerical values
          - It doesn't expand the feature space like one-hot encoding

### Intermediary Procedures
  * **Test Train Split**  
      - followed standard procedure, nothing fancy  
      - test_size=0.2, random_state=42  
  
  * **Normalization/Standardization of data**  
      - followed standard procedure, nothing fancy  
      - StandardScaler()  

  * **PCA**  
      - Not applicable as boosting algorithms take care of that automatically  

  * **SMOTE**  
      - Not applicable as it has the potential to mess up the data  




### Modelling

We are going to walk through the evolution of prediction for this dataset, just because it's fun to be the history man. The first, most rudimentary method for prediction is random guessing, but we're not going to do that. I underestimate grocery prices, so not transferring that skillset to here. The next simplest prediction is to compute the average; 9.5 million with a standard deviation of 10.19 million, which means that best case scenario im hitting the nail on the head with my prediction, and worst case I'm off by 10.19 million. This looks like the number of complaints Company X receives regarding its pricing model will remain the same, if not more. Next better solution we can work with is good old Linear Regression.

  **Regression:**  
      * Linear Regression  
      * Ridge  
      * Lasso  
      * ElasticNet  

  **Boosting:**  
      * XGBoost (Naive, Early Stopping, Optuna, Bayesian Optimization)  
      * LightGBM (Naive, HyperOpt)  

  **XAI:**  
      * SHAP  




### Evaluation

These metrics provide a comparison between the performance of **Regression** and **Boosting** models. Here's what they indicate:

**Evaluation metrics for various models (non-exhaustive):**

Model | train RMSE | test RMSE | train MAE | test MAE | train R2 | test R2
--- | --- | --- | --- |--- |--- |---
Linear Regression | 13.0577 | 11.6693 | 8.7676 | 8.1645 | 0.9368 | 0.9284
ElasticNet | 17.5434 | 11.5441 | 9.4788 | 8.2004 | 0.886 | 0.93
Ridge Regression | 13.2256 | 11.6453 | 8.4831 | 8.3665 | 0.9352 | 0.9287
Lasso Regression | 14.3109 | 11.1304 | 8.3424 | 7.8864 | 0.9241 | 0.9349
XGBoost | 0.8723 | 14.7035 | 0.6676 | 8.4476 | 0.9997 | 0.8864
XGBoost Early Stopping | 16.7731 | 9.8524 | 5.5904 | 6.2469 | 0.8958 | 0.949
XGBoost Bayesian Optimized | 5.6425 | 6.7717 | 1.8256 | 5.0569 | 0.9882 | 0.9759
LightGBM with HyperOpt | 24.1874 | 12.311 | 10.6885 | 8.8205 | 0.7833 | 0.9204

add more insights


### Improvements

    - using AI for parsing 'description' and coming up with a better score
    - code reorganization
    - more data -> better assessment of the model
    - would recommend grabbing lat-long of property on business-end
    - historical data would be tremendous in price prediction
    - better way of categorical encoding ['sub_area', 'company_name', 'township_society_name']
    - 



### Deployment:
    - MLFlow on Databrics is open source - for tracking and securing training runs for machine learning and deep learning models.  
    - Unity Catalog provides centralized model governance, cross-workspace access, lineage, and deployment.
    - 
