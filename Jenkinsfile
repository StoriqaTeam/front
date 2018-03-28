node {
    def app

    stage('Clone repository') {
        checkout scm
        sh 'git submodule update --init --recursive'
    }

    stage('Build app') {
        sh 'cp -f docker/Dockerfile.build Dockerfile'
        app = docker.build("storiqateam/stq-front:${env.BRANCH_NAME}")
        sh 'rm -f Dockerfile'
    }

    stage('Push image') {
        docker.withRegistry('https://registry.hub.docker.com', '4ca2ddae-a205-45f5-aaf7-333789c385cd') {
            app.push("${env.BRANCH_NAME}${env.BUILD_NUMBER}")
            app.push("${env.BRANCH_NAME}")
        }
    }
}
