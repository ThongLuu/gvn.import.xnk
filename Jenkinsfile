podTemplate(label: 'kubernetes', containers: [
    containerTemplate(name: 'buildkit', image: 'moby/buildkit:v0.10.6', ttyEnabled: true, privileged: true),
    containerTemplate(name: 'awscli', image: 'amazon/aws-cli:2.11.15', command: 'cat', ttyEnabled: true),
  ],
  volumes: [
    configMapVolume(configMapName: 'docker-config', mountPath: '/root/.docker'),
  ]) {
    node('kubernetes') {
      commitMessage = ""
      try {
        stage('Get source code') {
          echo 'Getting source code...'
          checkout scm
          String[] parts = sh(returnStdout: true, script: 'git log -1 --pretty=%B').trim().split('\n')
          commitMessage = parts[0]
        }
          REPO="gearvn.buildpc.service.fe"
          DOCKERFILE = "Dockerfile"
          FOLDER = "gearvn.buildpc.service.fe"
        if (env.BRANCH_NAME == 'main') {
          echo "Process build for ${env.BRANCH_NAME} branch"
          TAG="prod"
          build()
        } else if (env.BRANCH_NAME == 'uat') {
          echo "Process build for ${env.BRANCH_NAME} branch"
          TAG="uat"
          build()
        } else if (env.BRANCH_NAME == 'beta') {
          echo "Process build for ${env.BRANCH_NAME} branch"
          TAG="beta"
          build()
        }  else {
          echo "Khong phai branch (production|dev) nen ko lam gi"
          error('Failed to build')
        }
      } catch (exc) {
        currentBuild.result = 'FAILURE'
        echo 'I failed'
        echo exc.getMessage()
      }
      finally {
        echo 'One way or another, I have finished'
        deleteDir() /* clean up our workspace */
        if (currentBuild.result == 'SUCCESS') {
          echo 'Build successful'
        } else if (currentBuild.result == 'FAILURE') {
          echo 'I failed :('
        }
      }
    }
  }
def build() {
  currentTimestamp = sh(returnStdout: true, script: 'date +%s').trim()
  stage('Build') {
    container('buildkit') {
      withCredentials([[$class: 'AmazonWebServicesCredentialsBinding',credentialsId:'AWS',accessKeyVariable:'AWS_ACCESS_KEY_ID',secretKeyVariable:'AWS_SECRET_ACCESS_KEY']]){
        REGISTRY_URL="${env.AWS_ACCOUNT_ID}.dkr.ecr.ap-southeast-1.amazonaws.com/${REPO}"
        sh """
        wget https://amazon-ecr-credential-helper-releases.s3.us-east-2.amazonaws.com/0.6.0/linux-amd64/docker-credential-ecr-login -O /usr/local/bin/docker-credential-ecr-login
        chmod 755 /usr/local/bin/docker-credential-ecr-login
        buildctl build --frontend dockerfile.v0 --local context=. --local dockerfile=./ --opt build-arg:buildpc_api_host=${BUILDPC_API_HOST} --opt build-arg:public_url=${BUILDPC_PUBLIC_URL}  --opt filename=./${DOCKERFILE} --output 'type=image,name=${REGISTRY_URL}:${TAG},push=true'
        """
      }
    }
  }
  stage('Update GIT') {
    script {
      withCredentials([usernamePassword(credentialsId: 'CICD', passwordVariable: 'GITLAB_PASSWORD', usernameVariable: 'GITLAB_USERNAME')]) {
        // def encodedPassword = URLEncoder.encode("$GITLAB_PASSWORD",'UTF-8')
        sh """#!/bin/bash
        git config --global user.email jenkins@gearvn.com
        git config --global user.name jenkins
        git clone https://$GITLAB_USERNAME:$GITLAB_PASSWORD@${env.GIT_DEPLOYMENT} gearvn.k8s.deployment
        cd gearvn.k8s.deployment
        for file in ./${FOLDER}/${env.BRANCH_NAME}/deploy*.yaml; do sed -i 's|  date: .*|  date: "${currentTimestamp}"|' "\$file";git status; git add "\$file";done
        git commit -m 'Done by Jenkins Job changemanifest: ${REPO}:${env.BUILD_NUMBER}'
        git pull --rebase https://$GITLAB_USERNAME:$GITLAB_PASSWORD@${env.GIT_DEPLOYMENT}
        git push https://$GITLAB_USERNAME:$GITLAB_PASSWORD@${env.GIT_DEPLOYMENT} HEAD:refs/heads/main
        """
      }
    }
  }
  currentBuild.result = 'SUCCESS'
}

