pipeline {
    agent any
    tools {
        nodejs "NodeJS"
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/cherradia422/cve-api-project.git'
            }
        }
        stage('Install dependencies') {
            steps {
                sh 'npm install'
            }
        }
        stage('Lint') {
            steps {
                sh 'npx eslint . || true'
            }
        }
        stage('Security Scan') {
            steps {
                sh 'npm audit --audit-level=moderate || true'
            }
        }
    }
}
