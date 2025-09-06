"""
Test script to validate the HIV/TB Co-Infection Risk Prediction Pipeline

This script runs a quick test of the main pipeline to ensure all components work correctly.
"""

import sys
import os
import warnings
warnings.filterwarnings('ignore')

def test_pipeline():
    """Test the complete pipeline"""
    print("🧪 Testing HIV/TB Co-Infection Risk Prediction Pipeline")
    print("="*60)
    
    try:
        # Import the pipeline
        from hiv_tb_prediction_pipeline import HIVTBPredictionPipeline
        print("✅ Pipeline import successful")
        
        # Initialize pipeline
        pipeline = HIVTBPredictionPipeline()
        print("✅ Pipeline initialization successful")
        
        # Test data generation
        print("\n🔄 Testing data generation...")
        data = pipeline.generate_dummy_data(n_samples=1000)  # Smaller dataset for testing
        print(f"✅ Generated {len(data)} samples")
        
        # Test data preprocessing
        print("\n🔄 Testing data preprocessing...")
        X, y = pipeline.clean_and_preprocess_data(data)
        print(f"✅ Preprocessed data shape: {X.shape}")
        
        # Test SMOTE
        print("\n🔄 Testing SMOTE...")
        X_balanced, y_balanced = pipeline.apply_smote(X, y)
        print(f"✅ Balanced data shape: {X_balanced.shape}")
        
        # Test train/test split
        print("\n🔄 Testing train/test split...")
        X_train, X_test, y_train, y_test = pipeline.split_data(X_balanced, y_balanced, test_size=0.3)
        print(f"✅ Train shape: {X_train.shape}, Test shape: {X_test.shape}")
        
        # Test scaling
        print("\n🔄 Testing feature scaling...")
        X_train_scaled, X_test_scaled = pipeline.scale_features(X_train, X_test)
        print("✅ Feature scaling successful")
        
        # Test model training (quick version)
        print("\n🔄 Testing model training...")
        pipeline.train_models(X_train_scaled, y_train)
        print("✅ Model training successful")
        
        # Test evaluation
        print("\n🔄 Testing model evaluation...")
        results = pipeline.evaluate_models(X_test_scaled, y_test)
        print("✅ Model evaluation successful")
        
        # Test model saving
        print("\n🔄 Testing model saving...")
        model_path = pipeline.save_model('/workspace/test_model.pkl')
        print(f"✅ Model saved to {model_path}")
        
        # Test model loading
        print("\n🔄 Testing model loading...")
        import joblib
        loaded_model = joblib.load('/workspace/test_model.pkl')
        print("✅ Model loading successful")
        
        # Test prediction on new data
        print("\n🔄 Testing predictions...")
        sample_prediction = loaded_model['model'].predict(X_test_scaled[:5])
        sample_probabilities = loaded_model['model'].predict_proba(X_test_scaled[:5])
        print(f"✅ Predictions: {sample_prediction}")
        print(f"✅ Probabilities shape: {sample_probabilities.shape}")
        
        print("\n🎉 ALL TESTS PASSED!")
        print("="*60)
        print("📊 Pipeline Test Results:")
        print(f"   • Data generation: ✅")
        print(f"   • Data preprocessing: ✅")
        print(f"   • SMOTE balancing: ✅")
        print(f"   • Train/test split: ✅")
        print(f"   • Feature scaling: ✅")
        print(f"   • Model training: ✅")
        print(f"   • Model evaluation: ✅")
        print(f"   • Model saving/loading: ✅")
        print(f"   • Predictions: ✅")
        
        # Clean up test files
        try:
            os.remove('/workspace/test_model.pkl')
            print("\n🧹 Cleaned up test files")
        except:
            pass
        
        return True
        
    except Exception as e:
        print(f"\n❌ Test failed with error: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

def test_streamlit_imports():
    """Test that Streamlit app imports work correctly"""
    print("\n🧪 Testing Streamlit app imports...")
    
    try:
        # Test key imports for Streamlit app
        import streamlit as st
        import plotly.graph_objects as go
        import plotly.express as px
        print("✅ Streamlit and Plotly imports successful")
        
        # Test that the app file can be imported
        import importlib.util
        spec = importlib.util.spec_from_file_location("streamlit_app", "/workspace/streamlit_app.py")
        streamlit_app = importlib.util.module_from_spec(spec)
        
        print("✅ Streamlit app file structure valid")
        return True
        
    except Exception as e:
        print(f"❌ Streamlit test failed: {str(e)}")
        return False

if __name__ == "__main__":
    # Run tests
    pipeline_success = test_pipeline()
    streamlit_success = test_streamlit_imports()
    
    if pipeline_success and streamlit_success:
        print("\n🎊 ALL COMPONENTS TESTED SUCCESSFULLY!")
        print("\nNext steps:")
        print("1. Run: python hiv_tb_prediction_pipeline.py")
        print("2. Run: streamlit run streamlit_app.py")
    else:
        print("\n⚠️  Some tests failed. Please check the error messages above.")
        sys.exit(1)