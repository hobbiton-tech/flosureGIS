node {
    checkout scm

    docker.withRegistry('https://registry.hub.docker.com', 'hobbitontech') {

        def customImage = docker.build("hobbitontech/gl-flosure-ui:latest")

        /* Push the container to the custom Registry */
        customImage.push()
    }
}