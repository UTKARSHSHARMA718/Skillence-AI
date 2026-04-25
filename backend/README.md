# Docker 
## To create a new image
```
sudo docker build -t bootcamp_ai_backend .
```

## To run the created image
```
sudo docker run --rm -p 5000:5000 bootcamp_ai_backend
```


{
    "success": true,
    "data": {
        "vapiAssistant": {
            "id": "41d935c5-76c3-448e-b770-e54bd0769aea",
            "orgId": "c5e63a82-371d-4063-9d0f-704fc17b1d07",
            "name": "Interview - utkarsh - 1773191823813",
            "voice": {
                "voiceId": "Elliot",
                "provider": "vapi"
            },
            "createdAt": "2026-03-11T01:17:06.630Z",
            "updatedAt": "2026-03-11T01:17:06.630Z",
            "model": {
                "model": "gpt-4o-mini",
                "provider": "openai",
                "systemPrompt": "\n    You are an interviewer for a coding bootcamp. Conduct a coding interview with the candidate based on the following video topics.\n\n    candidate name: utkarsh\n    candidate email: utkarsh@gmail.com\n    candidate profile: software engineer\n\n\n    topics to cover in the interview:\n\n    [docker, k8s, microservices, data structures]\n    "
            },
            "firstMessage": "Hi utkarsh, I'm ready to begin your interview. Are you ready?",
            "isServerUrlSecretSet": false
        }
    },
    "message": "Request successful",
    "timestamp": "2026-03-11T01:17:04.636Z"
}

{
    "success": true,
    "data": {
        "webToken": {
            "subscriptionLimits": {
                "concurrencyBlocked": false,
                "concurrencyLimit": 10,
                "remainingConcurrentCalls": 9
            },
            "id": "019cda7d-a75d-7ee9-b9db-82c8c1eadc01",
            "orgId": "c5e63a82-371d-4063-9d0f-704fc17b1d07",
            "createdAt": "2026-03-11T01:23:13.885Z",
            "updatedAt": "2026-03-11T01:23:13.885Z",
            "type": "webCall",
            "cost": 0,
            "monitor": {
                "listenUrl": "wss://phone-call-websocket.aws-us-west-2-backend-production2.vapi.ai/019cda7d-a75d-7ee9-b9db-82c8c1eadc01/listen",
                "controlUrl": "https://phone-call-websocket.aws-us-west-2-backend-production2.vapi.ai/019cda7d-a75d-7ee9-b9db-82c8c1eadc01/control"
            },
            "transport": {
                "conversationType": "voice",
                "provider": "daily",
                "videoRecordingEnabled": false,
                "assistantVideoEnabled": false,
                "roomDeleteOnUserLeaveEnabled": true,
                "callUrl": "https://vapi.daily.co/bLE6NsVZZMAPdFiWhhWP"
            },
            "webCallUrl": "https://vapi.daily.co/bLE6NsVZZMAPdFiWhhWP",
            "status": "queued",
            "assistantId": "92aa0cdc-9742-47f4-a993-fe492e54fd96"
        },
        "vapiAssistant": {
            "id": "92aa0cdc-9742-47f4-a993-fe492e54fd96",
            "orgId": "c5e63a82-371d-4063-9d0f-704fc17b1d07",
            "name": "Interview - utkarsh - 1773192190561",
            "voice": {
                "voiceId": "Elliot",
                "provider": "vapi"
            },
            "createdAt": "2026-03-11T01:23:13.478Z",
            "updatedAt": "2026-03-11T01:23:13.478Z",
            "model": {
                "model": "gpt-4o-mini",
                "provider": "openai",
                "systemPrompt": "\n    You are an interviewer for a coding bootcamp. Conduct a coding interview with the candidate based on the following video topics.\n\n    candidate name: utkarsh\n    candidate email: utkarsh@gmail.com\n    candidate profile: software engineer\n\n\n    topics to cover in the interview:\n\n    [docker, k8s, microservices, data structures]\n    "
            },
            "firstMessage": "Hi utkarsh, I'm ready to begin your interview. Are you ready?",
            "isServerUrlSecretSet": false
        }
    },
    "message": "Request successful",
    "timestamp": "2026-03-11T01:23:11.641Z"
}
