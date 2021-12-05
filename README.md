# AWS lambda를 활용한 To Do List

<img src="https://user-images.githubusercontent.com/58679737/144734005-2c98b7fe-adb6-4bee-b79e-7fea4fa8e965.jpg" width="250" height="200"/>

--------------------------------------
## B. 멤버 이름 및 각자 담당한 파트 소개
* 20175167 최경준(조장) : 웹 사이트, db 연동 및 lamda 구축(aws)
* 20195286 이준범 : 웹 사이트, db 연동 및 lamda 구축(aws)
* 20187154 김준환 :  웹 사이트, 네이티브 ios db 연동 및 lamda 구축(aws)


----------------------------------------
## C. 프로젝트 소개 및 개발 내용 소개
## 프로젝트 소개
aws lambda를 이용하여 웹과 앱에서 서로 동기화가 가능한 todolist를 제작하였다. 구글 로그인의 경우 파이어베이스에서의 구글 로그인을 사용했으며, db는 mongodb atlas를 사용했다.  

## 개발 내용
IOS
* firebase를 이용한 구글 로그인
* Alamofire를 이용한 http request요청 및 response(JSON),error 받기
* 받은 response를 파싱하여 데이터 배열로 만든 후 todolist 목록 화면에 업데이트
* ToDoList CRUD 기능

WEB
* firebase를 이용한 구글 로그인
* fetch()함수를 이용한 http request 요청 및 response(JSON),error 받기
* 받은 response를 파싱하여 데이터 배열로 만든 후 todolist 목록 화면에 업데이트
* ToDoList CRD 기능

Lamda
* 각 http method별 api게이트웨이 추가
* todolist 목록 GET, POST, PUT, DELETE 처리 기능
* mongodb atlas 연결
* 각 리스트별 고유한 ID 추가, 등록한 시간 추가
* 이메일이 등록한 리스트 목록 가져오기

작동방식
1. 화면을 처음 켰을때 구글 로그인 화면이 나온다.
2. 구글 로그인을 할 경우 파이어 베이스에서 가입된 유저 목록을 확인한다. 가입된 유저 목록에 있을경우, 로그인한 구글이메일을 전송, todolist 화면으로 넘어감. 목록에 없을경우 등록을 한 후, 등록한 이메일을 전송, todolist 화면으로 넘어간다.
3. 해당 이메일에서 등록한 list를 db에서 가져오고 화면에 업데이트한다.
4. 리스트를 추가, 삭제, 수정할 경우 해당 이벤트별 등록 되어있는 함수에 의해 api 게이트웨이에 http request를 보낸다.
5. api 게이트웨이에서 request를 전달, lamda는 request method 형식에 따라 알맞은 case문으로 이를 보내고 이를 실행한다.
6. lambda에서 db에 작업을 요청하고 db의 결과에 따라 status 200, 500을 보낸다.
7. 요청이 정상적으로 성공했으면 status 200을 받고, 성공하지 않았으면 500을 받는다.
8. 데이터 추가, 삭제, 수정의 경우 요청이 성공했으면 다시 db에 저장된 데이터를 불러와서 화면을 업데이트 한다.

----------------------------------------
## D. 프로젝트 개발 결과물 소개
<img src="https://user-images.githubusercontent.com/58679737/144733965-0723d635-887a-4ab7-b999-210a92da9d9c.png" width="500" height="400"/>
인터넷이 연결되어있다면, 다른환경에서도 자신의 todolist에 접속, 조회, 추가, 수정, 삭제를 할 수 있다.

----------------------------------------
## E. 개발 결과물을 사용하는 방법 소개
> 구글 로그인
* 로그인 버튼을 누른 후 구글이메일, 비밀번호 입력

> 리스트 추가
* 웹: 텍스트 박스에 할 일을 적은 후 리스트 추가를 클릭한다.
* 앱: 오른쪽 상단에 위치한 + 버튼을 클릭 한 후 할 일을 입력한 후 추가 버튼을 누른다.

> 리스트 삭제
* 웹: 삭제할 리스트 오른쪽에 있는 x 버튼을 누른다.
* 앱: 삭제할 리스트를 왼쪽으로 슬라이드 한 후 delete를 누른다.

> 리스트 수정
* 앱: 수정할 리스트를 꾹 누른 후 수정할 텍스트를 입력 한 후 수정 버튼을 누른다.

> 로그아웃
* 웹: 하단에 있는 로그아웃 버튼 클릭.
* 앱: 왼쪽 상단에 있는 cancel 버튼 클릭.

* **이미지 클릭시 커짐**


![1](https://user-images.githubusercontent.com/58679737/144734013-e783126e-c68d-4d22-892d-3125a30585d1.PNG)


> 웹 구글 로그인



![2](https://user-images.githubusercontent.com/58679737/144734023-802618f7-9dd0-4686-a01c-8741899b58bd.PNG)



> ios 구글 로그인



![4](https://user-images.githubusercontent.com/58679737/144734033-d7fb7d7d-b397-40db-a1be-809f5f388aa3.PNG)


> 서로 연동이 가능하다


![5](https://user-images.githubusercontent.com/58679737/144734035-ff0bf5d2-686e-4efb-ac60-0d92ded73ea2.PNG)

> 할일 삭제


![6](https://user-images.githubusercontent.com/58679737/144734039-53103f22-7898-483c-890d-0f634bbc4184.PNG)

> 웹에서 할 일이 삭제된다


![7](https://user-images.githubusercontent.com/58679737/144734042-c733788e-ee2c-4b05-ab6d-475711b21b13.PNG)

> 웹에서 할 일을 추가한다


![8](https://user-images.githubusercontent.com/58679737/144734045-4356a8aa-5d8c-4354-a5c3-88a3a0d5e1bf.PNG)

> ios에 할 일이 추가된다

![9](https://user-images.githubusercontent.com/58679737/144734048-a880b0ff-def0-4227-b1fd-814f09932235.PNG)

> ios에서 할 일을 추가한다

![10](https://user-images.githubusercontent.com/58679737/144734051-7d7943a0-07b2-44e7-a80e-18042eed3895.PNG)

> 웹에 할 일이 추가 된다.
 
![11](https://user-images.githubusercontent.com/58679737/144734055-a35540cb-10c9-4495-9141-ace555488783.PNG)

> 사용 종료후 로그아웃 화면


----------------------------------------
## F. 개발 결과물의 필요성 및 활용방안

* 개발 결과물의 필요성 : 
우리는 살아가면서 공부,운동,아르바이트,모임 등과 같이 해야 할 일들이 너무 많다. 하지만 이러한 **많은 일들을 매순간마다 머리속으로 기억해두고 있기란 쉽지않다.** 더구나 기간이 따로 정해져 있는 시험이나, 과제 제출 같은 경우엔 **기억을 하지 못해 불상사가 발생할 수도 있기 때문에** 이런 불상사를 막기위해 우리의 To Do List가 필요하다. 

* 활용방안 : 사소한 일부터 중요한 일까지 자신이 꼭 해야 하는 일이 있다면 그것을 To Do List에 적어 하루에 계획을 세워 효율적인 하루를 보낼수 있게 해주거나 해야 할일을 까먹는 것을 막아 줄 수 있는 역할을 할 수 있다.  

----------------------------------------
