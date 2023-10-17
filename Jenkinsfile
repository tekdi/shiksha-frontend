pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
        cleanWs()
          git branch: 'prod', url: 'https://github.com/tekdi/shiksha-frontend.git'
      }
    }

    stage('Building Code') {
      steps {
        dir('/var/lib/jenkins/workspace/frontend') {
          sh 'rm -rf node_modules'
          sh 'rm -f package-lock.json'
          sh 'ls'
          sh 'yarn install'
          sh 'yarn workspace @shiksha/common-lib build'
          sh 'yarn install'
          sh 'yarn build'
        }
      }
    }

    stage('Copy Package') {
      steps {
        sh './scripts/pack-prod-build.sh'
        }
    }

    stage('Deploy') {
      steps {
        script {
          dir('/var/www/shiksha.uniteframework.io/public') {
            sh 'rm -rf *'
            sh 'cp /var/lib/jenkins/workspace/frontend/shiksha-ui.tar .'
            sh 'tar -xvf shiksha-ui.tar'
          }
        }
      }
    }
    }
  }
