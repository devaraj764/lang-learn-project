import { Button, HStack, Heading, VStack } from '@chakra-ui/react'


function PageNotFound() {
    return (
        <VStack alignContent={'center'} justifyContent={'center'} h={'100vh'}>
            <Heading fontSize={'50px'}>Page Not Found</Heading>
            <HStack>
                <Button onClick={() => {window.location.href = '/'}}>Go Home</Button>
        </HStack>
        </VStack >
    )
}

export default PageNotFound