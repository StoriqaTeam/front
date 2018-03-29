node {
    def intrm
    def bundle
    def front

    stage('Clone repository') {
        checkout scm
        sh 'git submodule update --init --recursive'
    }

    stage('Build app') {
        sh 'cp -f docker/Dockerfile.build Dockerfile'
        intrm = docker.build("storiqateam/stq-front-intrm:${env.BRANCH_NAME}")
        sh 'rm -f Dockerfile'
    }

    stage('Fetch artifacts') {
        sh "docker run -i -u root --rm --volume ${env.WORKSPACE}:/mnt/ storiqateam/stq-front-intrm:${env.BRANCH_NAME} cp -rf /app/build /mnt"
        sh "docker run -i -u root --rm --volume ${env.WORKSPACE}:/mnt/ storiqateam/stq-front-intrm:${env.BRANCH_NAME} cp -rf /app/dist /mnt"
    }

    stage('Build images') {
        sh 'cp -f docker/Dockerfile.front Dockerfile'
        front = docker.build("storiqateam/stq-front:${env.BRANCH_NAME}")
        sh 'rm Dockerfile'

        sh 'cp -f docker/Dockerfile.static Dockerfile'
        bundle = docker.build("storiqateam/stq-static:${env.BRANCH_NAME}")
        sh 'rm Dockerfile'
    }

    stage('Push image') {
        docker.withRegistry('https://registry.hub.docker.com', '4ca2ddae-a205-45f5-aaf7-333789c385cd') {
            front.push("${env.BRANCH_NAME}${env.BUILD_NUMBER}")
            front.push("${env.BRANCH_NAME}")

            bundle.push("${env.BRANCH_NAME}${env.BUILD_NUMBER}")
            bundle.push("${env.BRANCH_NAME}")
        }
    }

    stage('Clean up') {
        sh 'sudo /bin/rm -rf build dist'
        sh "docker rmi registry.hub.docker.com/storiqateam/stq-static:${env.BRANCH_NAME} registry.hub.docker.com/storiqateam/stq-static:${env.BRANCH_NAME}${env.BUILD_NUMBER}"
        sh "docker rmi registry.hub.docker.com/storiqateam/stq-front:${env.BRANCH_NAME} registry.hub.docker.com/storiqateam/stq-front:${env.BRANCH_NAME}${env.BUILD_NUMBER}"
        sh "docker rmi storiqateam/stq-front-intrm:${env.BRANCH_NAME}"
    }
}
