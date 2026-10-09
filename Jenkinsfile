pipeline {
  agent any

  options {
    timestamps()
    timeout(time: 20, unit: 'MINUTES')
    disableConcurrentBuilds()
  }

  environment {
    CI = 'true'
    VITE_DELCOM_BASEURL = 'https://open-api.delcom.org/api/v1'
    APP_PORT = '3000'
    BUN_INSTALL = "${WORKSPACE}/.bun"
    PATH = "${WORKSPACE}/.bun/bin:${PATH}"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Setup Bun') {
      steps {
        sh '''
          if ! command -v bun >/dev/null 2>&1; then
            curl -fsSL https://bun.sh/install | bash
          fi
          bun --version
        '''
      }
    }

    stage('Install Dependencies') {
      steps {
        sh 'bun install --frozen-lockfile'
      }
    }

    stage('Unit Test & Coverage') {
      steps {
        // Gagal jika coverage < 100% (threshold diatur di vite.config.js)
        sh 'bun run test:coverage'
      }
      post {
        always {
          junit allowEmptyResults: true, testResults: 'test-results/junit.xml'
        }
      }
    }

    stage('SonarQube Analysis') {
      steps {
        script {
          def scannerHome = tool 'SonarScanner'
          withSonarQubeEnv('SonarQube') {
            sh "${scannerHome}/bin/sonar-scanner"
          }
        }
      }
    }

    stage('Quality Gate') {
      steps {
        timeout(time: 5, unit: 'MINUTES') {
          waitForQualityGate abortPipeline: true
        }
      }
    }

    stage('Build') {
      steps {
        sh 'bun run build'
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'coverage/**', allowEmptyArchive: true
    }
    success {
      echo 'Pipeline berhasil: test 100%, Quality Gate lolos, build selesai.'
    }
    failure {
      echo 'Pipeline gagal. Periksa log pada stage yang berwarna merah.'
    }
  }
}
