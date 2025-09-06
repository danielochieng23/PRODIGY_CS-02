"""
Setup script for HIV/TB Co-Infection Risk Prediction Pipeline

This script helps users set up the environment and run the pipeline.
"""

import subprocess
import sys
import os

def install_requirements():
    """Install required packages"""
    print("📦 Installing required packages...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Requirements installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install requirements: {e}")
        return False

def run_pipeline():
    """Run the main pipeline"""
    print("\n🚀 Running the main pipeline...")
    try:
        subprocess.check_call([sys.executable, "hiv_tb_prediction_pipeline.py"])
        print("✅ Pipeline completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Pipeline failed: {e}")
        return False

def launch_streamlit():
    """Launch the Streamlit app"""
    print("\n🌐 Launching Streamlit app...")
    print("📝 Note: The app will open in your default web browser at http://localhost:8501")
    print("📝 Press Ctrl+C to stop the app")
    
    try:
        subprocess.run(["streamlit", "run", "streamlit_app.py"])
    except KeyboardInterrupt:
        print("\n👋 Streamlit app stopped")
    except FileNotFoundError:
        print("❌ Streamlit not found. Please install it with: pip install streamlit")

def main():
    """Main setup function"""
    print("🏥 HIV/TB Co-Infection Risk Prediction Pipeline Setup")
    print("="*60)
    
    # Check if we're in the right directory
    required_files = [
        "hiv_tb_prediction_pipeline.py",
        "streamlit_app.py", 
        "requirements.txt",
        "README.md"
    ]
    
    missing_files = [f for f in required_files if not os.path.exists(f)]
    if missing_files:
        print(f"❌ Missing required files: {missing_files}")
        print("Please ensure you're in the correct directory with all project files.")
        return
    
    print("✅ All required files found")
    
    # Menu
    while True:
        print("\n" + "="*60)
        print("What would you like to do?")
        print("1. Install requirements")
        print("2. Run test pipeline")
        print("3. Run full pipeline")
        print("4. Launch Streamlit app")
        print("5. Exit")
        print("="*60)
        
        choice = input("Enter your choice (1-5): ").strip()
        
        if choice == "1":
            install_requirements()
            
        elif choice == "2":
            print("\n🧪 Running test pipeline...")
            try:
                subprocess.check_call([sys.executable, "test_pipeline.py"])
            except subprocess.CalledProcessError as e:
                print(f"❌ Test failed: {e}")
                
        elif choice == "3":
            success = run_pipeline()
            if success:
                print("\n🎉 Pipeline completed! Generated files:")
                print("   • hiv_tb_coinfection_model.pkl (trained model)")
                print("   • model_evaluation_plots.png (performance plots)")
                print("   • shap_explanations.png (interpretability plots)")
                
        elif choice == "4":
            # Check if model exists
            if not os.path.exists("hiv_tb_coinfection_model.pkl"):
                print("⚠️  Model file not found. Please run the pipeline first (option 3).")
                continue
            launch_streamlit()
            
        elif choice == "5":
            print("👋 Goodbye!")
            break
            
        else:
            print("❌ Invalid choice. Please enter 1-5.")

if __name__ == "__main__":
    main()