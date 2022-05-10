window.addEventListener('DOMContentLoaded', function() {

  //json 데이터
  const dataResult = fetch('https://hyojinjeong.github.io/bank.json')
    .then((res) => {
      return res.json();
    })
    .then((obj) => {
      //console.log(obj.bankList[0]);
      test(obj)
    });

  // 잔고
  function test(obj) {
    console.log(obj);
    console.log(obj.bankList[2]);
    let sum = 0;
    let minus = 0;
    let plus = 0;


    console.log(obj.bankList[0].income);
    const main_money = document.querySelector('.account_balance_area span');

    // if(obj.bankList[1].income === 'out'){
    //   minus = obj.bankList[1].income;
    //   console.log(minus); 
    // }

    // 지출
    const outArray = obj.bankList.filter(function(e) {
      return e.income === 'out';
    });
    console.log(outArray);
    for(let i = 0; i < outArray.length; i++){
      minus += outArray[i].price;
    }
    console.log(minus);

    // 수입
    const inArray = obj.bankList.filter((e) => {
      return e.income === 'in';
    });
    console.log(inArray);
    for(let i = 0; i < inArray.length; i++){
      plus += inArray[i].price;
    }
    console.log(plus - minus);


    for(let i = 0; i < obj.bankList.length; i++){
      // if(obj.bankList[i].income === 'out'){
      //   minus += obj.bankList[i].income
        
      // }
      // minus = obj.bankList[i].filter((e) => {
      //   return obj.bankList[i].income === 'out';
      // });


      // 총 잔고
      sum += obj.bankList[i].price;
    }

    console.log(sum);
    main_money.textContent = plus - minus;
  }

  // const myMoney = ;

  const winhh = window.outerHeight;

  //사이즈가 조절될 때
  window.addEventListener('resize', () => {
    //console.log(winhh);
    const mainhh2 = window.outerHeight;
    sethh(mainhh2);
  });
  sethh(winhh);

  // 지출관리 열기
  const openManage = document.querySelector('.account_goal_area .manage_btn');
  openManage.addEventListener('click', () => {
    document.querySelector('.manage_wrap').style.cssText = 'opacity: 1; top: 0';
  });
  // 지출관리 닫기버튼
  const manageCloseBtn = document.querySelector('.manage_wrap header.manage_header .close_btn');

  manageCloseBtn.addEventListener('click', () => {
    document.querySelector('.manage_wrap').style.cssText = 'opacity: 0; top: 100%';
  })

  /* 메인화면 높이 조절 */
  function sethh(winhh){
    const mainHeader = document.querySelector('.main_header');
    const mainHeaderhh = mainHeader.offsetHeight;
    const accountMain = document.querySelector('.account_main');
    const accountMainhh = accountMain.offsetHeight;
    const accountHistory =  document.querySelector('.account_history');
    //const accountHistoryhh = accountHistory.offsetHeight;
    const mainMenu = document.querySelector('.menu');
    const menuhh = mainMenu.offsetHeight;
    const managehh = document.querySelector('.manage_wrap');

    //accountHistory 높이 설정
    const setAccountHishh = winhh - mainHeaderhh - accountMainhh - menuhh;
    accountHistory.style.height = `${setAccountHishh}px`;

    managehh.style.height = `${winhh - menuhh}px`;
    
  }

  // progressbar
  function progressbar(total, goal){
    /*
    * 전체, 목표, 쓴 금액, 디데이, 사용가능 금액
    */
  }
});