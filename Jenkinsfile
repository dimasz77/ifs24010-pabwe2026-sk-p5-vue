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
    PATH = "${WORKSPACE}/.node/bin:${WORKSPACE}/.bun/bin:${PATH}"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Setup Node') {
      steps {
        sh '''
          if [ ! -x .node/bin/node ]; then
            NODE_VERSION=22.12.0
            ARCH=$(uname -m)
            case "$ARCH" in
              x86_64) NODE_ARCH=x64 ;;
              aarch64|arm64) NODE_ARCH=arm64 ;;
              *) echo "Arsitektur tidak didukung: $ARCH"; exit 1 ;;
            esac
            curl -fsSL "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-${NODE_ARCH}.tar.gz" -o node.tar.gz
            mkdir -p .node
            tar -xzf node.tar.gz -C .node --strip-components=1
            rm -f node.tar.gz
          fi
          which node
          node --version
        '''
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