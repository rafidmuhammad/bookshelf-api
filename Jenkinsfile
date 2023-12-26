pipeline {
    agent any

    environment {
        // Define environment variables
        DOCKER_IMAGE_NAME = "bookshelf-api"
        DOCKER_REGISTRY_URL = "rafidmuhammad"
        DOCKER_HUB_URL = "https://hub.docker.com/repository/docker/rafidmuhammad"
        DOCKER_REGISTRY_ID = "rafidmuhammad-docker"
        COMMIT_SHA = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
        POSTMAN_API_KEY = "PMAK-657e746bf2bff300387a6026-719c7cb61c3079dca95b2814f384498499"
    }

    stages {
        stage('Checkout') {
            steps {
                // Checkout source code from version control
                script {
                    echo 'Checkouting...'
                    checkout scm
                }
            }
        }

        stage('Build') {
            steps {
                // Build and tag the Docker image
                script {
                    echo 'Building...'
                    echo "${DOCKER_REGISTRY_URL}"
                    echo "${DOCKER_IMAGE_NAME}"
                    echo "${COMMIT_SHA}"
                    docker.build("${DOCKER_REGISTRY_URL}/${DOCKER_IMAGE_NAME}:${COMMIT_SHA}")
                }
            }
        }

        stage('Push to Registry') {
            steps {
                // Push the Docker image to a container registry
              script {
                    echo 'Pushing...'
                    def dockerLogin = sh(script: "docker login -u rafidmuhammad -p Apit190301", returnStatus: true)
                    
                    if(dockerLogin != 0){
                        error("Docker login failed")
                    }
                    
                    def dockerPush = sh(script: "docker push ${DOCKER_REGISTRY_URL}/${DOCKER_IMAGE_NAME}:${COMMIT_SHA}", returnStatus: true)
                    
                    if(dockerPush != 0){
                        error("Docker push failed")
                    }
                }
            }
        }
            
        stage('Deploy for Integration Testing') {
            steps {
                // Add deployment steps here
                echo 'Deploying for integration...'
                sh "docker run -d -p 5050:5000 --name integration-test-container ${DOCKER_REGISTRY_URL}/${DOCKER_IMAGE_NAME}:${COMMIT_SHA}"
            }
        }

        stage('Install Postman CLI') {
            steps {
                echo 'Intalling Postman CLI...'
                sh 'curl -o- "https://dl-cli.pstmn.io/install/linux64.sh" | sh'
                sh 'ls -a'
            }
        }

        stage('Postman CLI Login') {
            steps {
                    echo 'Loggin in to Postman CLI...'
                    sh 'postman login --with-api-key $POSTMAN_API_KEY'
                }
            }
        
        stage('Integration Testing'){
            steps {
                echo 'Testing...'
                sh 'postman collection run "23923510-e67169b6-e0a8-4e5c-865c-88317134ae1f"-e "23923510-f5f55732-1c66-4c08-8af6-5d66290fecfb"'
            }
        }
    }
}
