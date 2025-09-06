"""
Predictive AI for Identifying HIV/TB Co-Infection Risk in Rural Kenyan Farming Communities

This pipeline implements a complete machine learning workflow for predicting HIV/TB co-infection
risk using demographic, health, and behavioral data from rural Kenyan communities.

Author: Research Team
Project: HIV/TB Co-Infection Risk Prediction
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    confusion_matrix, classification_report, roc_auc_score, roc_curve
)
from imblearn.over_sampling import SMOTE
import xgboost as xgb
import shap
import joblib
import warnings
warnings.filterwarnings('ignore')

# Set random seed for reproducibility
np.random.seed(42)

class HIVTBPredictionPipeline:
    """
    Complete pipeline for HIV/TB co-infection risk prediction
    """
    
    def __init__(self):
        self.models = {}
        self.scaler = StandardScaler()
        self.label_encoders = {}
        self.feature_names = None
        self.best_model = None
        
    def generate_dummy_data(self, n_samples=5000):
        """
        Generate realistic dummy data representing rural Kenyan farming communities
        
        Args:
            n_samples (int): Number of samples to generate
            
        Returns:
            pd.DataFrame: Generated dataset
        """
        print("🔄 Generating dummy dataset for rural Kenyan farming communities...")
        
        np.random.seed(42)
        
        # Demographics
        age = np.random.normal(35, 12, n_samples)
        age = np.clip(age, 18, 70)  # Age between 18-70
        
        gender = np.random.choice(['Male', 'Female'], n_samples, p=[0.48, 0.52])
        
        education_levels = ['None', 'Primary', 'Secondary', 'Tertiary']
        education = np.random.choice(education_levels, n_samples, p=[0.25, 0.45, 0.25, 0.05])
        
        marital_status = np.random.choice(['Single', 'Married', 'Divorced', 'Widowed'], 
                                        n_samples, p=[0.20, 0.60, 0.10, 0.10])
        
        # Socioeconomic factors
        income_monthly = np.random.exponential(150, n_samples)  # USD per month
        income_monthly = np.clip(income_monthly, 20, 1000)
        
        household_size = np.random.poisson(5, n_samples)
        household_size = np.clip(household_size, 1, 12)
        
        # Health and behavioral factors
        bmi = np.random.normal(22, 3, n_samples)
        bmi = np.clip(bmi, 15, 35)
        
        smoking = np.random.choice([0, 1], n_samples, p=[0.75, 0.25])
        alcohol_use = np.random.choice([0, 1], n_samples, p=[0.60, 0.40])
        
        # Healthcare access
        distance_to_clinic = np.random.exponential(8, n_samples)  # km
        distance_to_clinic = np.clip(distance_to_clinic, 0.5, 50)
        
        previous_hiv_test = np.random.choice([0, 1], n_samples, p=[0.30, 0.70])
        previous_tb_test = np.random.choice([0, 1], n_samples, p=[0.50, 0.50])
        
        # Symptoms and health indicators
        persistent_cough = np.random.choice([0, 1], n_samples, p=[0.80, 0.20])
        weight_loss = np.random.choice([0, 1], n_samples, p=[0.85, 0.15])
        night_sweats = np.random.choice([0, 1], n_samples, p=[0.90, 0.10])
        fatigue = np.random.choice([0, 1], n_samples, p=[0.70, 0.30])
        
        # Farming-specific factors
        livestock_contact = np.random.choice([0, 1], n_samples, p=[0.30, 0.70])
        crop_type = np.random.choice(['Maize', 'Beans', 'Tea', 'Coffee', 'Mixed'], 
                                   n_samples, p=[0.35, 0.25, 0.15, 0.10, 0.15])
        
        # Environmental factors
        water_source = np.random.choice(['Well', 'River', 'Borehole', 'Tap'], 
                                      n_samples, p=[0.40, 0.30, 0.20, 0.10])
        
        # Create target variable with realistic prevalence
        # HIV prevalence ~4.9% in Kenya, TB ~0.3%, co-infection ~1.5% of HIV positive
        hiv_risk_factors = (
            (age > 25) * 0.3 +
            (gender == 'Female') * 0.2 +
            (education == 'None') * 0.4 +
            (income_monthly < 100) * 0.3 +
            smoking * 0.2 +
            alcohol_use * 0.1 +
            (distance_to_clinic > 10) * 0.2 +
            (previous_hiv_test == 0) * 0.3
        )
        
        tb_risk_factors = (
            (bmi < 20) * 0.4 +
            persistent_cough * 0.5 +
            weight_loss * 0.4 +
            night_sweats * 0.3 +
            fatigue * 0.2 +
            livestock_contact * 0.1 +
            smoking * 0.3 +
            (household_size > 6) * 0.2
        )
        
        # Co-infection risk (higher if both HIV and TB risk factors present)
        coinfection_probability = (
            0.01 +  # Base rate
            hiv_risk_factors * 0.02 +
            tb_risk_factors * 0.015 +
            (hiv_risk_factors * tb_risk_factors) * 0.03  # Interaction effect
        )
        
        coinfection_probability = np.clip(coinfection_probability, 0, 0.15)
        hiv_tb_coinfection = np.random.binomial(1, coinfection_probability, n_samples)
        
        # Create DataFrame
        data = pd.DataFrame({
            'age': age,
            'gender': gender,
            'education': education,
            'marital_status': marital_status,
            'income_monthly_usd': income_monthly,
            'household_size': household_size,
            'bmi': bmi,
            'smoking': smoking,
            'alcohol_use': alcohol_use,
            'distance_to_clinic_km': distance_to_clinic,
            'previous_hiv_test': previous_hiv_test,
            'previous_tb_test': previous_tb_test,
            'persistent_cough': persistent_cough,
            'weight_loss': weight_loss,
            'night_sweats': night_sweats,
            'fatigue': fatigue,
            'livestock_contact': livestock_contact,
            'crop_type': crop_type,
            'water_source': water_source,
            'hiv_tb_coinfection': hiv_tb_coinfection
        })
        
        print(f"✅ Generated dataset with {len(data)} samples")
        print(f"📊 Co-infection prevalence: {data['hiv_tb_coinfection'].mean():.2%}")
        
        return data
    
    def load_and_merge_data(self, use_dummy=True):
        """
        Load and merge datasets. Uses dummy data by default.
        
        Args:
            use_dummy (bool): Whether to use generated dummy data
            
        Returns:
            pd.DataFrame: Merged dataset
        """
        if use_dummy:
            return self.generate_dummy_data()
        else:
            # This section would load real datasets
            # hiv_data = pd.read_csv('hiv_data.csv')
            # tb_data = pd.read_csv('tb_data.csv')
            # demographics = pd.read_csv('demographics.csv')
            # health_records = pd.read_csv('health_records.csv')
            # 
            # # Merge datasets on patient_id or similar key
            # merged_data = pd.merge(hiv_data, tb_data, on='patient_id', how='outer')
            # merged_data = pd.merge(merged_data, demographics, on='patient_id', how='left')
            # merged_data = pd.merge(merged_data, health_records, on='patient_id', how='left')
            
            print("⚠️  Real data loading not implemented. Using dummy data instead.")
            return self.generate_dummy_data()
    
    def clean_and_preprocess_data(self, data):
        """
        Clean and preprocess the dataset
        
        Args:
            data (pd.DataFrame): Raw dataset
            
        Returns:
            tuple: (X, y) preprocessed features and target
        """
        print("🧹 Cleaning and preprocessing data...")
        
        # Handle missing values
        print(f"📋 Missing values before cleaning:\n{data.isnull().sum()}")
        
        # Fill numerical missing values with median
        numerical_cols = data.select_dtypes(include=[np.number]).columns
        for col in numerical_cols:
            if data[col].isnull().sum() > 0:
                data[col].fillna(data[col].median(), inplace=True)
        
        # Fill categorical missing values with mode
        categorical_cols = data.select_dtypes(include=['object']).columns
        for col in categorical_cols:
            if data[col].isnull().sum() > 0:
                data[col].fillna(data[col].mode()[0], inplace=True)
        
        # Separate features and target
        X = data.drop('hiv_tb_coinfection', axis=1)
        y = data['hiv_tb_coinfection']
        
        # Encode categorical variables
        categorical_features = X.select_dtypes(include=['object']).columns
        for col in categorical_features:
            le = LabelEncoder()
            X[col] = le.fit_transform(X[col])
            self.label_encoders[col] = le
        
        # Store feature names
        self.feature_names = X.columns.tolist()
        
        print(f"✅ Data preprocessing completed")
        print(f"📊 Dataset shape: {X.shape}")
        print(f"🎯 Target distribution:\n{y.value_counts(normalize=True)}")
        
        return X, y
    
    def apply_smote(self, X, y):
        """
        Apply SMOTE to handle class imbalance
        
        Args:
            X (pd.DataFrame): Features
            y (pd.Series): Target variable
            
        Returns:
            tuple: (X_resampled, y_resampled)
        """
        print("⚖️  Applying SMOTE for class imbalance...")
        
        print(f"📊 Before SMOTE - Class distribution:\n{pd.Series(y).value_counts()}")
        
        smote = SMOTE(random_state=42)
        X_resampled, y_resampled = smote.fit_resample(X, y)
        
        print(f"📊 After SMOTE - Class distribution:\n{pd.Series(y_resampled).value_counts()}")
        
        return X_resampled, y_resampled
    
    def split_data(self, X, y, test_size=0.2):
        """
        Split data into training and testing sets with stratification
        
        Args:
            X (pd.DataFrame): Features
            y (pd.Series): Target variable
            test_size (float): Proportion of test set
            
        Returns:
            tuple: (X_train, X_test, y_train, y_test)
        """
        print(f"🔄 Splitting data into train ({1-test_size:.0%}) and test ({test_size:.0%}) sets...")
        
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=test_size, random_state=42, stratify=y
        )
        
        print(f"📊 Training set shape: {X_train.shape}")
        print(f"📊 Test set shape: {X_test.shape}")
        
        return X_train, X_test, y_train, y_test
    
    def scale_features(self, X_train, X_test):
        """
        Scale numerical features using StandardScaler
        
        Args:
            X_train (pd.DataFrame): Training features
            X_test (pd.DataFrame): Test features
            
        Returns:
            tuple: (X_train_scaled, X_test_scaled)
        """
        print("📏 Scaling numerical features...")
        
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Convert back to DataFrame to maintain feature names
        X_train_scaled = pd.DataFrame(X_train_scaled, columns=X_train.columns)
        X_test_scaled = pd.DataFrame(X_test_scaled, columns=X_test.columns)
        
        return X_train_scaled, X_test_scaled
    
    def train_models(self, X_train, y_train):
        """
        Train multiple machine learning models
        
        Args:
            X_train (pd.DataFrame): Training features
            y_train (pd.Series): Training target
        """
        print("🤖 Training multiple models...")
        
        # Define models
        models = {
            'Logistic Regression': LogisticRegression(random_state=42, max_iter=1000),
            'Random Forest': RandomForestClassifier(
                n_estimators=100, random_state=42, n_jobs=-1
            ),
            'XGBoost': xgb.XGBClassifier(
                random_state=42, eval_metric='logloss', n_jobs=-1
            )
        }
        
        # Train models
        for name, model in models.items():
            print(f"🔄 Training {name}...")
            model.fit(X_train, y_train)
            self.models[name] = model
            print(f"✅ {name} training completed")
        
        # Set XGBoost as the best model (main focus)
        self.best_model = self.models['XGBoost']
        print("🏆 XGBoost selected as the main predictive model")
    
    def evaluate_models(self, X_test, y_test):
        """
        Evaluate all trained models
        
        Args:
            X_test (pd.DataFrame): Test features
            y_test (pd.Series): Test target
        """
        print("📊 Evaluating model performance...")
        
        results = {}
        
        for name, model in self.models.items():
            print(f"\n{'='*50}")
            print(f"📊 {name} Evaluation")
            print('='*50)
            
            # Make predictions
            y_pred = model.predict(X_test)
            y_pred_proba = model.predict_proba(X_test)[:, 1]
            
            # Calculate metrics
            accuracy = accuracy_score(y_test, y_pred)
            precision = precision_score(y_test, y_pred)
            recall = recall_score(y_test, y_pred)
            f1 = f1_score(y_test, y_pred)
            roc_auc = roc_auc_score(y_test, y_pred_proba)
            
            results[name] = {
                'accuracy': accuracy,
                'precision': precision,
                'recall': recall,
                'f1_score': f1,
                'roc_auc': roc_auc
            }
            
            # Print metrics
            print(f"Accuracy:  {accuracy:.4f}")
            print(f"Precision: {precision:.4f}")
            print(f"Recall:    {recall:.4f}")
            print(f"F1-Score:  {f1:.4f}")
            print(f"ROC-AUC:   {roc_auc:.4f}")
            
            # Classification report
            print(f"\n📋 Classification Report:")
            print(classification_report(y_test, y_pred))
            
            # Confusion Matrix
            cm = confusion_matrix(y_test, y_pred)
            print(f"\n🔍 Confusion Matrix:")
            print(cm)
        
        return results
    
    def plot_evaluation_metrics(self, X_test, y_test):
        """
        Create visualization plots for model evaluation
        
        Args:
            X_test (pd.DataFrame): Test features
            y_test (pd.Series): Test target
        """
        print("📈 Creating evaluation visualizations...")
        
        fig, axes = plt.subplots(2, 2, figsize=(15, 12))
        
        # 1. Model Comparison Bar Plot
        metrics = ['accuracy', 'precision', 'recall', 'f1_score', 'roc_auc']
        model_names = list(self.models.keys())
        
        metric_data = {metric: [] for metric in metrics}
        
        for name in model_names:
            model = self.models[name]
            y_pred = model.predict(X_test)
            y_pred_proba = model.predict_proba(X_test)[:, 1]
            
            metric_data['accuracy'].append(accuracy_score(y_test, y_pred))
            metric_data['precision'].append(precision_score(y_test, y_pred))
            metric_data['recall'].append(recall_score(y_test, y_pred))
            metric_data['f1_score'].append(f1_score(y_test, y_pred))
            metric_data['roc_auc'].append(roc_auc_score(y_test, y_pred_proba))
        
        x = np.arange(len(model_names))
        width = 0.15
        
        for i, metric in enumerate(metrics):
            axes[0, 0].bar(x + i*width, metric_data[metric], width, label=metric)
        
        axes[0, 0].set_xlabel('Models')
        axes[0, 0].set_ylabel('Score')
        axes[0, 0].set_title('Model Performance Comparison')
        axes[0, 0].set_xticks(x + width * 2)
        axes[0, 0].set_xticklabels(model_names, rotation=45)
        axes[0, 0].legend()
        axes[0, 0].grid(True, alpha=0.3)
        
        # 2. ROC Curves
        for name, model in self.models.items():
            y_pred_proba = model.predict_proba(X_test)[:, 1]
            fpr, tpr, _ = roc_curve(y_test, y_pred_proba)
            auc_score = roc_auc_score(y_test, y_pred_proba)
            axes[0, 1].plot(fpr, tpr, label=f'{name} (AUC = {auc_score:.3f})')
        
        axes[0, 1].plot([0, 1], [0, 1], 'k--', label='Random')
        axes[0, 1].set_xlabel('False Positive Rate')
        axes[0, 1].set_ylabel('True Positive Rate')
        axes[0, 1].set_title('ROC Curves')
        axes[0, 1].legend()
        axes[0, 1].grid(True, alpha=0.3)
        
        # 3. Confusion Matrix for XGBoost
        y_pred_xgb = self.best_model.predict(X_test)
        cm = confusion_matrix(y_test, y_pred_xgb)
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', ax=axes[1, 0])
        axes[1, 0].set_title('XGBoost Confusion Matrix')
        axes[1, 0].set_xlabel('Predicted')
        axes[1, 0].set_ylabel('Actual')
        
        # 4. Feature Importance (XGBoost)
        feature_importance = self.best_model.feature_importances_
        feature_names = self.feature_names
        
        # Sort features by importance
        importance_df = pd.DataFrame({
            'feature': feature_names,
            'importance': feature_importance
        }).sort_values('importance', ascending=True).tail(10)
        
        axes[1, 1].barh(importance_df['feature'], importance_df['importance'])
        axes[1, 1].set_title('Top 10 Feature Importance (XGBoost)')
        axes[1, 1].set_xlabel('Importance')
        
        plt.tight_layout()
        plt.savefig('/workspace/model_evaluation_plots.png', dpi=300, bbox_inches='tight')
        plt.show()
        
        print("✅ Evaluation plots saved as 'model_evaluation_plots.png'")
    
    def explain_model_with_shap(self, X_train, X_test):
        """
        Use SHAP to explain model predictions
        
        Args:
            X_train (pd.DataFrame): Training features
            X_test (pd.DataFrame): Test features
        """
        print("🔍 Generating SHAP explanations for model interpretability...")
        
        # Create SHAP explainer
        explainer = shap.TreeExplainer(self.best_model)
        
        # Calculate SHAP values for test set (sample for efficiency)
        sample_size = min(500, len(X_test))
        X_test_sample = X_test.sample(sample_size, random_state=42)
        shap_values = explainer.shap_values(X_test_sample)
        
        # Create SHAP visualizations
        plt.figure(figsize=(15, 10))
        
        # Summary plot
        plt.subplot(2, 2, 1)
        shap.summary_plot(shap_values, X_test_sample, feature_names=self.feature_names, 
                         show=False, plot_type='bar')
        plt.title('SHAP Feature Importance')
        
        # Summary plot with feature values
        plt.subplot(2, 2, 2)
        shap.summary_plot(shap_values, X_test_sample, feature_names=self.feature_names, 
                         show=False)
        plt.title('SHAP Summary Plot')
        
        plt.tight_layout()
        plt.savefig('/workspace/shap_explanations.png', dpi=300, bbox_inches='tight')
        plt.show()
        
        # Print top features
        feature_importance_shap = np.abs(shap_values).mean(0)
        importance_df = pd.DataFrame({
            'feature': self.feature_names,
            'shap_importance': feature_importance_shap
        }).sort_values('shap_importance', ascending=False)
        
        print("\n🏆 Top 10 Most Important Features (SHAP):")
        print("="*50)
        for i, (_, row) in enumerate(importance_df.head(10).iterrows(), 1):
            print(f"{i:2d}. {row['feature']:<25} | Importance: {row['shap_importance']:.4f}")
        
        print("✅ SHAP explanations completed and saved as 'shap_explanations.png'")
        
        return shap_values, explainer
    
    def save_model(self, model_path='/workspace/hiv_tb_coinfection_model.pkl'):
        """
        Save the trained model and preprocessing objects
        
        Args:
            model_path (str): Path to save the model
        """
        print(f"💾 Saving trained model and preprocessing objects...")
        
        model_package = {
            'model': self.best_model,
            'scaler': self.scaler,
            'label_encoders': self.label_encoders,
            'feature_names': self.feature_names
        }
        
        joblib.dump(model_package, model_path)
        print(f"✅ Model saved successfully to {model_path}")
        
        return model_path
    
    def run_complete_pipeline(self):
        """
        Run the complete machine learning pipeline
        """
        print("🚀 Starting HIV/TB Co-Infection Risk Prediction Pipeline")
        print("="*70)
        
        # Step 1: Load and merge data
        data = self.load_and_merge_data(use_dummy=True)
        
        # Step 2: Clean and preprocess data
        X, y = self.clean_and_preprocess_data(data)
        
        # Step 3: Apply SMOTE for class imbalance
        X_balanced, y_balanced = self.apply_smote(X, y)
        
        # Step 4: Split data
        X_train, X_test, y_train, y_test = self.split_data(X_balanced, y_balanced)
        
        # Step 5: Scale features
        X_train_scaled, X_test_scaled = self.scale_features(X_train, X_test)
        
        # Step 6: Train models
        self.train_models(X_train_scaled, y_train)
        
        # Step 7: Evaluate models
        results = self.evaluate_models(X_test_scaled, y_test)
        
        # Step 8: Create evaluation plots
        self.plot_evaluation_metrics(X_test_scaled, y_test)
        
        # Step 9: SHAP explanations
        shap_values, explainer = self.explain_model_with_shap(X_train_scaled, X_test_scaled)
        
        # Step 10: Save model
        model_path = self.save_model()
        
        print("\n🎉 Pipeline completed successfully!")
        print("="*70)
        print(f"📊 Best Model: XGBoost")
        print(f"💾 Model saved to: {model_path}")
        print(f"📈 Visualizations saved: model_evaluation_plots.png, shap_explanations.png")
        
        return results, model_path


def main():
    """
    Main function to run the pipeline
    """
    # Initialize and run pipeline
    pipeline = HIVTBPredictionPipeline()
    results, model_path = pipeline.run_complete_pipeline()
    
    return pipeline, results, model_path


if __name__ == "__main__":
    pipeline, results, model_path = main()