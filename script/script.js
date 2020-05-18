'use strict';
document.addEventListener('DOMContentLoaded', function () {
    const btnOpenModal = document.querySelector('#btnOpenModal');
    const modalBlock = document.querySelector('#modalBlock');
    const closeModal = document.querySelector('#closeModal');
    const questionTitle = document.querySelector('#question');
    const formAnswers = document.querySelector('#formAnswers');
    const burgerBtn = document.getElementById('burger');
    burgerBtn.style.display = 'none';
    const nextButton =document.querySelector('#next');
    const prevButton =document.querySelector('#prev');
    const modalDialog = document.querySelector('.modal-dialog');
    const sendButton =document.querySelector('#send');
    const modalTitle = document.querySelector('.modal-title');

    const firebaseConfig = {
        apiKey: "AIzaSyBA-gjT6D-9NRu2_FXl_dVzKFjJfHqJq0Y",
        authDomain: "testquiz-50911.firebaseapp.com",
        databaseURL: "https://testquiz-50911.firebaseio.com",
        projectId: "testquiz-50911",
        storageBucket: "testquiz-50911.appspot.com",
        messagingSenderId: "733138255555",
        appId: "1:733138255555:web:7ef28fbacc2f8ecdee6c76",
        measurementId: "G-WVBQFTQVW7"
        };
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);


    const getData = () => {
        formAnswers.textContent = 'LOAD';
        nextButton.classList.add('d-none');
        prevButton.classList.add('d-none');
        setTimeout(() => {
            firebase.database().ref().child('questions').once('value')
            .then(snap => playTest(snap.val()))  
        },1500)
           
    }

   
    let clientWidth = document.documentElement.clientWidth;

    if (clientWidth < 768) {
        burgerBtn.style.display = 'flex';
    } else {
        burgerBtn.style.display = 'none';
    }

    window.addEventListener('resize', function () {
        clientWidth = document.documentElement.clientWidth;
        if (clientWidth < 768) {
            burgerBtn.style.display = 'flex';
        } else {
            burgerBtn.style.display = 'none'
        }

    });

    burgerBtn.addEventListener('click', function () {
        burgerBtn.classList.add('active');

        modalBlock.classList.add('d-block');
        playTest();
    });

  
      let count = -100;
   
    modalDialog.style.top = count + '%';

    const animateModal = () => {
        modalDialog.style.top = count + '%';
        count+=3;

        if ( count < 0){
            requestAnimationFrame(animateModal);
           }else{
            count = -100;
            // console.log(stop);
           }
    };
  

       btnOpenModal.addEventListener('click', () => {
        requestAnimationFrame(animateModal);
        modalBlock.classList.add('d-block');
        getData();
        // playTest();
    });

    closeModal.addEventListener('click', () => {
        modalBlock.classList.remove('d-block');
        burgerBtn.classList.remove('active');
    });

    document.addEventListener('click', function (event) {
        // console.log(event.target);

        if (
            !event.target.closest('.modal-dialog') &&
            !event.target.closest('.openModalButton') &&
            !event.target.closest('.burger')
        ) {
            modalBlock.classList.remove('d-block');

        }
       
    });

    const playTest = (questions) => {
        const finalAnswers = [];
        const obj = {};

        let numberQuestion = 0;
        modalTitle.textContent = 'Ответь на вопрос';

        const renderAnswers = (index) => {

            questions[index].answers.forEach((answer) => {
                                             
                const answerItem = document.createElement('div');

                answerItem.classList.add('answers-item', 'd-flex', 'justyfy-content-center');

                answerItem.innerHTML = `
                    <input type="${questions[index].type}" id="${answer.title}" name="answer" class="d-none" value = "${answer.title}">
                        <label for="${answer.title}" class="d-flex flex-column justify-content-between">
                        <img class="answerImg" src="${answer.url}" alt="burger">
                        <span>${answer.title}</span>
                    </label>
                `;
                formAnswers.appendChild(answerItem);

                                
            });
        }
        const renderQuestions = (indexQuestion) => {
            formAnswers.innerHTML = ``;

            if(numberQuestion >= 0 && numberQuestion <= questions.length - 1) {
                questionTitle.textContent =  `${questions[indexQuestion].question}`
                renderAnswers(indexQuestion);
                nextButton.classList.remove('d-none');
                prevButton.classList.remove('d-none');
                sendButton.classList.add('d-none');
            }

            if(numberQuestion === 0){
                prevButton.classList.add('d-none');
            }

            
            if(numberQuestion === questions.length){
                questionTitle.textContent = '';
                modalTitle.textContent = '';
                nextButton.classList.add('d-none');
                prevButton.classList.add('d-none');
                sendButton.classList.remove('d-none');
                formAnswers.innerHTML = `
                <div class="form-group">
                    <label for="numberPhone">Введите ваш номер телефона</label>
                    <input type="phone" class="form-control" id="numberPhone">
                </div>
                `;

                const numberPhone = document.getElementById('numberPhone');
                numberPhone.addEventListener('input', (event) => {
                    event.target.value = event.target.value.replace(/[^0-9+-]/, '');
                //   console.log(event.target.value);

                });
                
                
            }

            if(numberQuestion === questions.length + 1) {
                formAnswers.textContent = 'Спасибо за заказ';
                sendButton.classList.add('d-none');

                for (let key in obj){
                    // console.log(key, obj[key]);
                    let newObj = {};
                    newObj = obj[key];
                    finalAnswers.push(newObj);
                }
                // console.log(finalAnswers);

                setTimeout(() => {
                    modalBlock.classList.remove('d-block');
                }, 2000);
            }
        }

        renderQuestions(numberQuestion);

        const checkAnswer = () => {
            // console.log('check');
            
            const inputs = [...formAnswers.elements].filter((input) => input.checked || input.id === 'numberPhone')

            inputs.forEach((input, index) => {
                if(numberQuestion >= 0 && numberQuestion <= questions.length - 1) {
                obj[`${index}_${questions[numberQuestion].question}`] = input.value;
              }

                if(numberQuestion === questions.length){
                    obj['Номер телефона'] = input.value;
                }
           })

          
            // finalAnswers.push(obj)
            // console.log(finalAnswers);



        }

        nextButton.onclick = () => {
            checkAnswer();
            numberQuestion++;
            renderQuestions(numberQuestion);
            // console.log(' next: ',  next);
            // console.dir(nextButton);

        }

        prevButton.onclick = () => {
            numberQuestion--;
            renderQuestions(numberQuestion);
            // console.log('prev: ', prev);
        }
            

        sendButton.onclick = () => {
            checkAnswer();
            numberQuestion++;
            renderQuestions(numberQuestion);
            firebase
            .database()
            .ref()
            .child('contacts')
            .push(finalAnswers)



            // console.log(finalAnswers);
            
        }
    }

  
  
}); 

