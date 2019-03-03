const { SHA256 } = require('crypto-js')

const message = '4'
const hashed = SHA256(message).toString()
const user1 = {  //이건 데이터베이스에 존제하는 것이라고 생각하자.
    id: 4
} // 실제 user id를 가지고 hash를 할거임....... 
  // JSON.stringify(data) 이것 자체는 순수 텍스트임 {"id":4}라는.

const token = {
    user1,
    hash: SHA256(JSON.stringify(user1) + 'somesecret').toString()
}

// const result = SHA256(JSON.stringify(token.data) + 'somesecret').toString() 

// 데이터베이스 밖의 해커가 id를 다른 것으로 입력한 후
// 그걸 해쉬처리한다치자
// 그러나 솔트를 모르는게 핵심
// 즉, 데이터만 가지고 해싱한거랑 솔트를 가지고 해싱한거랑이 절대로 같을 수 없다는 간단한 논리.

// 해커의 행동. 아이디의 값을 바꾸려한다.
token.user1.id = 5
token.hash = SHA256(JSON.stringify(token.user1)).toString() // salt없는 것

const result = SHA256(JSON.stringify(token.user1) + 'somesecret').toString() // 정상 토큰화 과정


if (result === token.hash) {
    console.log('Data was not changed')
} else {
    console.log('Data was changed do not trust it')
}