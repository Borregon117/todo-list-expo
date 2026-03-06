pipeline {
    agent any
    
    tools {
        nodejs 'Node20' // Mantenemos tu versión funcional
    }
    
    environment {
        SONAR_TOKEN = credentials('sonar-token') [cite: 342]
    }
    
    stages {
        stage('Limpiar e Instalar Dependencias') {
            steps {
                // Al correr en el contenedor Linux de Jenkins, rm -rf funciona perfecto
                sh 'rm -rf node_modules package-lock.json' [cite: 347]
                sh 'npm install' [cite: 348]
            }
        }
        
        stage('Auditoría de Seguridad') {
            steps {
                sh 'npm audit --audit-level=moderate || true' [cite: 353]
            }
        }
        
        stage('Ejecutar Linter') {
            steps {
                sh 'npm run lint || true' [cite: 358]
            }
        }
        
        stage('Pruebas con Cobertura') {
            steps {
                script {
                    def exitCode = sh(script: 'npm run test', returnStatus: true) [cite: 364]
                    if (exitCode != 0) { [cite: 365]
                        currentBuild.result = 'UNSTABLE' [cite: 366]
                        echo "Las pruebas fallaron. El build se marca como inestable." [cite: 367]
                    }
                }
            }
            post {
                always {
                    script {
                        if (fileExists('junit.xml')) { [cite: 374]
                            junit 'junit.xml' [cite: 375]
                        }
                    }
                }
            }
        }
        
        stage('Análisis SonarQube') {
            steps {
                withSonarQubeEnv('SonarQube') { [cite: 383]
                    script {
                        def scannerHome = tool name: 'SonarQube Scanner', type: 'hudson.plugins.sonar.SonarRunnerInstallation' [cite: 385]
                        // Mantenemos la corrección de seguridad
                        sh "${scannerHome}/bin/sonar-scanner -Dsonar.token=\$SONAR_TOKEN"
                    }
                }
            }
        }
        
        stage('Quality Gate') {
            steps {
                timeout(time: 1, unit: 'HOURS') { [cite: 393]
                    waitForQualityGate abortPipeline: true [cite: 394]
                }
            }
        }
        
        stage('Build (Exportar Web)') {
            steps {
                // Genera la carpeta dist con la versión web de tu app React Native
                sh 'npm run build' [cite: 400]
            }
        }
        
        stage('Archivar Artefactos') {
            steps {
                archiveArtifacts artifacts: 'dist/**', fingerprint: true [cite: 405]
            }
        }
    }
    
    post {
        always {
            cleanWs() [cite: 411]
        }
    }
}