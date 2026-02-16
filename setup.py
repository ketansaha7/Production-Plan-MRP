from setuptools import setup, find_packages

with open("README.md", "r") as fh:
    long_description = fh.read()

setup(
    name="production_warehouse_app",
    version="1.0.0",
    author="Your Name",
    author_email="your@email.com",
    description="ERPNext app for warehouse group selection in Production Plan with MRP calculation",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/yourusername/production_warehouse_app",
    packages=find_packages(),
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires='>=3.7',
    install_requires=[
        "frappe",
    ],
    include_package_data=True,
    zip_safe=False
)
