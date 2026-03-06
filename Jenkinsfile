pipeline {
    agent any
    
    tools {
        nodejs 'Node20'
    }
    
    environment {
        SONAR_TOKEN = credentials('sonar-token')
    }
    
    stages {
        stage('Limpiar e Instalar Dependencias') {
            steps {
                sh 'rm -rf node_modules package-lock.json'
                sh 'npm install'
            }
        }
        
        stage('Auditoría de Seguridad') {
            steps {
                sh 'npm audit --audit-level=moderate || true'
            }
        }
        
        stage('Ejecutar Linter') {
            steps {
                sh 'npm run lint || true'
            }
        }
        
        stage('Pruebas con Cobertura') {
            steps {
                script {
                    def exitCode = sh(script: 'npm run test', returnStatus: true)
                    if (exitCode != 0) {
                        currentBuild.result = 'UNSTABLE'
                        echo "Las pruebas fallaron. El build se marca como inestable."
                    }
                }
            }
            post {
                always {
                    script {
                        if (fileExists('junit.xml')) {
                            junit 'junit.xml'
                        }
                    }
                }
            }
        }
        
        stage('Análisis SonarQube') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    script {
                        def scannerHome = tool name: 'SonarQube Scanner', type: 'hudson.plugins.sonar.SonarRunnerInstallation'
                        sh "${scannerHome}/bin/sonar-scanner -Dsonar.token=\$SONAR_TOKEN"
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
        
        stage('Build (Exportar Web)') {
            steps {
                sh 'npm run build'
            }
        }
        
        stage('Archivar Artefactos') {
            steps {
                archiveArtifacts artifacts: 'dist/**', fingerprint: true
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
    }
}