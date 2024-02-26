pipeline {
    agent any
        stages {
         stage('clean workspace'){
            steps{
                cleanWs()
            }
        }
        stage('Checkout'){
            
            steps{
               
            //   git branch: 'main', credentialsId: 'github-1', url: 'https://github.com/tekdi/shiksha-backend.git'
               //  checkout scmGit(branches: [[name: '*/oblf-21stFeb']], extensions: [], userRemoteConfigs: [[credentialsId: 'github-1', url: 'https://github.com/tekdi/shiksha-backend.git']])
                 checkout scmGit(branches: [[name: '*/oblf-21stFeb']], extensions: [], userRemoteConfigs: [[credentialsId: 'github-1', url: 'https://github.com/tekdi/shiksha-frontend.git']])
                
                echo "========================== ***Repository cloned Successfully*** =========================="
            
          }
        }
    
        stage ('Build&Deploy') {
            
            steps {
                                    
                        sh 'yarn install'
                        sh 'yarn run build'
                        sh './scripts/pack-prod-build.sh'
                }
            }

       }
}
