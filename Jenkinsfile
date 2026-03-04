pipeline {
    agent any
    
    tools {
        // IMPORTANTE: Este nombre debe ser EXACTAMENTE el que pusiste en el campo "Name" 
        // dentro de Global Tool Configuration en Jenkins.
        nodejs 'Node20' 
    }
    
    environment {
        // Asegúrate de que creaste esta credencial en Jenkins con este ID exacto
        SONAR_TOKEN = credentials('sonar-token') 
    }
    
    stages {
        stage('Checkout') {
            steps {
                
                checkout scm
            }
        }
        
        stage('Instalar Dependencias') {
            steps {
                sh 'npm install'
            }
        }
        
        stage('Ejecutar Linter') {
            steps {
                
                sh 'npm run lint || true'
            }
        }
        
        stage('Análisis SonarQube') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    script {
                        // Asegúrate de que la herramienta se llame así en Global Tool Configuration
                        def scannerHome = tool name: 'SonarQube Scanner', type: 'hudson.plugins.sonar.SonarRunnerInstallation'
                        sh "${scannerHome}/bin/sonar-scanner -Dsonar.login=${SONAR_TOKEN}"
                    }
                }
            }
        }
        
        stage('Quality Gate') {
            steps {
                timeout(time: 1, unit: 'HOURS') {
                    
                    waitForQualityGate abortPipeline: true
                }
            }
        }
    }
    
    post {
        always {
            cleanWs() 
        }
    }
}