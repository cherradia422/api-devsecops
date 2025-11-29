pipeline {
    agent any

    tools {
        nodejs "Node20"
    }

    environment {
        SONAR_SCANNER_HOME = tool 'SonarQube'
        JWT_SECRET = credentials('jwt_secret')
    }

    stages {
        stage('Checkout') {
            steps {
                // ✅ Uses your Jenkins credential ID for private GitHub access
                git branch: 'main', 
                    url: 'https://github.com/cherradia422/api-devsecops.git',
                    credentialsId: 'Github_token'
            }
        }

        stage('Install dependencies') {
            steps {
                echo '📦 Installing Node.js dependencies...'
                sh 'npm install'
            }
        }

        stage('Lint') {
            steps {
                echo '🔍 Running ESLint...'
                sh 'npx eslint . || true'
            }
        }

        stage('Security Scan') {
            steps {
                echo '🛡️ Running npm audit...'
                sh 'npm audit --audit-level=moderate || true'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                echo '📊 Running SonarQube Analysis...'
                withSonarQubeEnv('SonarQube') {
                    sh '''
                        ${SONAR_SCANNER_HOME}/bin/sonar-scanner \
                            -Dsonar.projectKey=cve-api-project \
                            -Dsonar.projectName="CVE API Project" \
                            -Dsonar.sources=. \
                            -Dsonar.language=js \
                            -Dsonar.sourceEncoding=UTF-8 \
                            -Dsonar.host.url=http://13.53.228.21:9000 \
                            -Dsonar.login=${SonarQube_token}
                    '''
                }
            }
        }

        stage('Quality Gate') {
            steps {
                echo '🚦 Waiting for SonarQube Quality Gate result...'
                timeout(time: 2, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        
     // 🐳 Build and Deploy Locally
         stage('Build and Deploy Docker Image') {
            steps {
                script {
                    sh "docker build -t cve-api:latest ."
                    sh "docker stop cve-api || true"
                    sh "docker rm cve-api || true"
                    sh """
                        docker run -d \
                        --name cve-api \
                        -p 5000:5000 \
                        -e JWT_SECRET=${JWT_SECRET} \
                        cve-api:latest
                    """
                }
            }
        }
    }


    post {
        success {
            echo '✅ Build and SonarQube analysis completed successfully!'
        }
        failure {
            echo '❌ Build or SonarQube analysis failed!!!'
        }
    }
}