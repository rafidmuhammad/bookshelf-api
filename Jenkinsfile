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

        stage('Integration Testing'){
            steps {
                echo 'Testing...'
                sh 'newman run bookshelf-API-test.postman_collection.json --environment bookshelf-API-test-copy.postman_environment.json'
            }
        }
    }
}
