var __tutorials = {
  active:null,
  activeStep:null,
  queue:[],
  content: $('#tutorials .bubble'),
  val:null,
  areas:[],
  blinker:null,
  /* 
   * Runs a tutorial given as idx parameter
   */
  start:function(idx){
    if (this.val !== null && isset(this.list[idx]) && this.active === null){
      if (this.val < 0 || !((this.val&Math.pow(2, idx)) == 0)) return this.stop();
      var T = this;
      this.active = idx;
      this.activeStep = 0;
      this.print();
      $('#tutorials').fadeIn();
      this.blinker=setInterval(function(){
        for(var i=0; i<T.areas.length; i++){
          if (T.areas[i].css('display') != 'none'){
            if (T.areas[i].css('opacity') == 1) T.areas[i].css('opacity', 0.3);
            else T.areas[i].css('opacity', 1);
          }
        }
      },500);
      this.skipSelected(this.active);
    }else{
      this.addToQueue(idx);
    }
  },
  addToQueue:function(idx){
    if (isset(this.list[idx]) && this.queue.indexOf(idx) < 0){
      this.queue.push(idx);
    }
  },
  runQueue:function(){
    if (this.queue.length) this.start(this.queue.splice(0,1));
  },
  /* Switch to the next step of active tutorial (if there is more than one step in it)
   */
  next:function(){
    this.activeStep++;
    this.print();
  },
  /* Puts active step text into speech bubble and draws highlights if needed
   */
  print:function(){
    g.lock.remove('tutorials');
    this.clearAreas();
    Highlighter.hide();
    var T = this;
    var step = this.list[this.active][this.activeStep];
    $('#tutorials .bubble').find('.container').html(step.t);
    $('#tutorials .bubble').find('.interface').remove();
    if(isset(step.callback) && typeof(step.callback) == 'function') step.callback();
    if (isset(step.a)) $('#tutorials').attr('class', step.a);
    else $('#tutorials').attr('class', null);
    if (isset(step.stop) && step.stop) g.lock.add('tutorials');
    var links = $(document.createElement('div')).addClass('interface');
    links.append($(document.createElement('a')).addClass('end').click(function(){T.skipAll()}).text(_t('turn_off', null, 'tutorials')).attr('tip', _t('turn_off_nfo', null, 'tutorials'))) //'WyÅÄcz' //'WyÅÄcza samouczek, moÅ¼esz go pÃ³Åºniej wÅÄczyÄ w konfiguracji na stronie gÅÃ³wnej.'
    if (this.activeStep == this.list[this.active].length-1)
      links.append($(document.createElement('a')).text(_t('finish', null, 'tutorials')).click(function(){T.skip()})); //'ZakoÅcz'
    else{
      links.append($(document.createElement('a')).text(_t('next', null, 'tutorials')).click(function(){T.next()})); //'Dalej'
      links.append($(document.createElement('a')).text(_t('skip', null, 'tutorials')).click(function(){T.skip()})); //'PomiÅ'
    }
    $('#tutorials .bubble').append(links);
    var data = {
      hs:isset(step.hs)?step.hs:null, //highlight areas
      ha:isset(step.ha)?step.ha:null, //highlight selector (can be only one element matched in selector)
      fs:isset(step.fs)?step.fs:null, //frame area
      fa:isset(step.fa)?step.fa:null,  //frame DOM elements from selector (multiple elements)
      nolight:(isset(step.nolight) && step.nolight) //force highlight disable
    }
    this.highlightArea(data);
    this.onresize();
  },
  /* Marks active tutorial as done and hides tutorial window.
   */
  skip:function(){
    this.skipSelected(this.active);
    this.stop();
    Highlighter.hide();
  },
  skipSelected:function(step){
    return;
    var T=this;
    if(g.init>4){
      _g('tutorial&opt='+(this.val|Math.pow(2,step)));
    }else{
      setTimeout(function(){T.skipSelected(step)},100);
    }
  },
  /* Clears variables and prepares object for another tutorial
   */
  stop:function(){
    this.active = null;
    this.activeStep = null;
    clearInterval(this.blinker);
    g.lock.remove('tutorials');
    Highlighter.hide();
    this.clearAreas();
    $('#tutorials').hide();
    if (this.queue.length){
      var q = this.queue.splice(0,1);
      setTimeout('tutorialStart('+q[0]+')', 100);
    }
  },
  onresize:function(){
    if(this.activeStep === null) return;
    var loc = 'center';
    if(isset(this.list[this.active][this.activeStep].a)){
      loc = this.list[this.active][this.activeStep].a;
    }
    switch(loc){
      case 'center':
        $('#tutorials').css({
          right:'auto',bottom:'auto',top:'auto',left:'auto'
        }).absCenter();
        break;
      case 'bottom':
        $('#tutorials').css({
          bottom:10,
          top:'auto',right:'auto',
          left:$(window).width()/2 - $('#tutorials').width()/2
        })
        break;
      case 'top':
        $('#tutorials').css({
          top:10,
          right:'auto',bottom:'auto',
          left:$(window).width()/2 - $('#tutorials').width()/2
        })
        break;
      case 'l':
        if(Highlighter.coords === null) break;
        $('#tutorials').css({
          top:$('#centerbox').offset().top + Highlighter.coords[1] + (Highlighter.coords[3]/2) - $('#tutorials').height()/2,
          right:$(window).width() - ($('#centerbox').offset().left + Highlighter.coords[0]) + 10,
          bottom:'auto',
          left:'auto'
        });
        break;
      case 'r':
        if(Highlighter.coords === null) break;
        $('#tutorials').css({
          top:$('#centerbox').offset().top + Highlighter.coords[1] + (Highlighter.coords[3]/2) - $('#tutorials').height()/2,
          left:$('#centerbox').offset().left + Highlighter.coords[0] + Highlighter.coords[2] + 10,
          bottom:'auto',
          right:'auto'
        });
        break;
      case 't':
        if(Highlighter.coords === null) break;
        $('#tutorials').css({
          bottom:$(window).height() - Highlighter.coords[1] - $('#centerbox').offset().top + 10,
          left:$('#centerbox').offset().left + Highlighter.coords[0] + Highlighter.coords[2]/2 - $('#tutorials').width()/2,
          top:'auto',
          right:'auto'
        });
        break;
      case 'b':
        if(Highlighter.coords === null) break;
        $('#tutorials').css({
          top:$('#centerbox').offset().top + Highlighter.coords[1] + Highlighter.coords[3] + 10,
          left:$('#centerbox').offset().left + Highlighter.coords[0] + Highlighter.coords[2]/2 - $('#tutorials').width()/2,
          bottom:'auto',
          right:'auto'
        });
        break;
    }
  },
  /* Removes highlighted areas
   */
  clearAreas:function(){
    while(this.areas.length>0){
      var a = this.areas.pop();
      a.remove();
    }
  },
  /* prints areas given in 'a' parameter
   */
  highlightArea:function(a){
    var of = $('#centerbox2').offset();
    
    /** SHOW HIGHLIGHTS **/
    if (a.hs){
      /*
       *Exception for highlighting entries (when a.hs == 'gw'), needed to add different parent for highlight's dom elements 
       */
      var tmp = $(a.hs);
      if (a.hs == '.gw'){
        //calculate area with all .gw's
      }else{
        var tmpoff = tmp.offset();
        Highlighter.lightArea(
          tmpoff.left-of.left, 
          tmpoff.top-of.top, 
          tmp.width(), 
          tmp.height()
        );
      }
    }
    if (a.ha){
      Highlighter.lightArea(
        a.ha[0], 
        a.ha[1], 
        a.ha[2], 
        a.ha[3]
      );
    }
    /** END SHOW HIGHLIGHTS **/
    
    /** SHOW FRAMES **/
    if (a.fs){
      var list = $(a.fs);
      /*
       *Exception for entries (when a.hs == 'gw'), needed to add different parent for frames's dom elements 
       */
      for(var i=0; i<list.length; i++){
        var tmp = $(list[i]);
        var tmpoff = {};
        var tmpArea = $(document.createElement('div'));
        if (a.fs == '.gw'){
          tmpoff = {top:parseInt(tmp.css('top')),left:parseInt(tmp.css('left'))};
        }else{
          tmpoff = tmp.offset();
        }
        tmpArea.css({
          top: (tmpoff.top - (a.fs=='.gw'?0:of.top) - 2),
          left: (tmpoff.left - (a.fs=='.gw'?0:of.left) - 2),
          width: tmp.width(),
          height: tmp.height()
        }).addClass('tut_area')//.mouseover(function(){$(this).css('display','none')});
        $(a.fs=='.gw'?'#base':'#centerbox2').append(tmpArea);
        this.areas.push(tmpArea);
      }
    }
    if (a.fa){
      var list2 = a.fa;
      for(var i=0; i<list2.length; i++){
        var tmp2 = list2[i];
        var tmpArea2 = $(document.createElement('div'))
        tmpArea2.css({
          top: tmp2[1],
          left: tmp2[0],
          width: tmp2[2],
          height: tmp2[3]
        }).addClass('tut_area').mouseover(function(){$(this).css('display','none')});
        $('#centerbox2').append(tmpArea2);
        this.areas.push(tmpArea2);
      }
    }
    /** END SHOW FRAMES **/
  },
  /* Marks all tutorials as done in engine
   */
  skipAll:function(){
    _g('tutorial&opt=-'+(this.val|Math.pow(2,this.active)));
    this.stop();
  },
  /*
   * t - message
   * a - align, possible: left/right, default: right
   * hs - id of element to highlight, eg: '#helpbut'
   * ha - areas to highlight, format: [[x,y,w,h], [[x,y,w,h]]], eg: [[100,100,20,20], [100,100,20,20]]
   * 
   * fs - id of element to frame (RED), eg: '#helpbut'
   * fa - areas to frame (RED), format: [[x,y,w,h], [[x,y,w,h]]], eg: [[100,100,20,20], [100,100,20,20]]
   */
  list:{
    0:[ // wejÅcie do gry
      {t:_t('t_0.0', null, 'tutorials'), stop:true},
      //'Witaj! Jestem Makina, bÄdÄ TwojÄ przewodniczkÄ po krainie Margonem! WÅaÅnie ocknÄÅeÅ siÄ po dÅugiej chorobie spowodowanej ranami zadanymi przez potwory.'
      {t:_t('t_0.1', null, 'tutorials'), stop:true, a:'t', callback:function(){Highlighter.startH.synchroStart('tutorial');}},
      //'Aby siÄ poruszaÄ uÅ¼yj strzaÅek lub kliknij myszkÄ w miejsce, do ktÃ³rego chciaÅbyÅ dojÅÄ. Aby porozmawiaÄ z mieszkaÅcem, podejdÅº do niego, kliknij na postaÄ i wybierz Rozmawiaj.'
      {t:_t('t_0.2', null, 'tutorials'), fs:"#helpbut", a:'l', stop:true}
      //'W kaÅ¼dej chwili moÅ¼esz wybraÄ przycisk <a href="#" onclick="showHelp(); return false;">Sterowanie</a>, aby przypomnieÄ sobie, jak wykonuje siÄ jakÄÅ akcjÄ w grze.'
    ],
    1:[ // gracz rozpoczal pierwszy dialog , czesc I, czesc II na koncu
      {t:_t('t_1.0', null, 'tutorials')}
      //'Åwietnie! WÅaÅnie rozmawiasz z mieszkaÅcem krainy Margonem. MoÅ¼esz siÄ wiele od niego dowiedzieÄ, wybieraj pytania lub zakoÅcz dialog klikajÄc na odpowiedÅº podÅwietlonÄ na Å¼Ã³Åto.'
    ],
    2:[ // gracz wylazÅ z budynku startowego
      {t:_t('t_2.0', null, 'tutorials')},
      //'Dobra robota! Teraz moÅ¼esz porozmawiaÄ z innymi mieszkaÅcami lub zdobyÄ doÅwiadczenie w walce. ZnajdÅº jakieÅ zwierzÄ na 1 poziomie doÅwiadczenia. SÄ to zazwyczaj krÃ³liki, zajÄce, wiewiÃ³rki itp. Na razie nie prÃ³buj walczyÄ z niczym silniejszym!'
      {t:_t('t_2.1', null, 'tutorials')},
      //'Aby rozpoczÄÄ walkÄ, naleÅ¼y podejÅÄ do zwierzÄcia, kliknÄÄ na nie lewym przyciskiem myszy i wybraÄ Atakuj. Walka przebiegnie automatycznie, po jej zakoÅczeniu pokaÅ¼e siÄ okienko ÅupÃ³w. JeÅli zaakceptujesz Åup, zostanie przeniesiony do plecaka. Okienko walki zamkniesz klikajÄc Zamknij. ZwierzÄ po upÅywie kilku chwil pojawi siÄ znowu w tym miejscu.'
      {t:_t('t_2.2', null, 'tutorials'), a:'l', hs:'#b_map', fs:'#b_map', nolight:true}
      //'JeÅli siÄ zgubisz, uÅ¼yj mapy Åwiata Margonem. JeÅli bÄdziesz chciaÅ coÅ komuÅ powiedzieÄ, to naciÅnij Enter i zacznij pisaÄ wiadomoÅÄ.'
    ],
    3:[ // zdobycie przedmiotu z loota
      {t:_t('t_3.0', null, 'tutorials'), a:'bottom'},
      //'Brawo! ZdobyÅeÅ swÃ³j pierwszy przedmiot! JeÅli jest konsumpcyjny, to moÅ¼esz go spoÅ¼yÄ, klikajÄc na niego dwukrotnie lub przeciÄgajÄc w miejsce zaÅoÅ¼enia broni i pancerza. Zjedzenie takiego przedmiotu pozwala odzyskaÄ kilka punktÃ³w Å¼ycia. Zdobyte przedmioty warto sprzedaÄ w sklepie, aby zdobyÄ zÅoto na wyposaÅ¼enie.'
      {t:_t('t_3.1', null, 'tutorials'), a:'bottom'},
      //'Przedmioty zdobywa siÄ nie tylko w walkach. MoÅ¼na zrywaÄ kwiaty, owoce i podnosiÄ przedmioty leÅ¼Äce na ziemi. Aby to zrobiÄ staÅ na przedmiocie, naciÅnij na swojÄ postaÄ i wybierz PodnieÅ.'
    ],
    4:[ // 2 poziom doÅwiadczenia
      {t:_t('t_4.0', null, 'tutorials'), a:'l', hs: '#base3'}
      //'ZdobyÅeÅ nastÄpny poziom doÅwiadczenia! Punkty statystyk zostaÅy rozdane automatycznie, pÃ³Åºniej bÄdziesz mÃ³gÅ to robiÄ sam. JesteÅ silniejszy, wiÄc warto pomyÅleÄ o zakupie broni i pancerza. W kaÅ¼dej wiosce jest handlarz lub sprzedawca, ktÃ³ry posiada sklep z potrzebnymi rzeczami.'
    ],
    5:[ // maÅo Å¼ycia
      {t:_t('t_5.0', null, 'tutorials'), a:'l', hs:'#life1', fs: '#life1', nolight:true}
      //'StoczyÅeÅ wiele walk, ale nikt nie jest niezniszczalny. W kaÅ¼dej wiosce znajduje siÄ uzdrowiciel, ktÃ³ry opatrzy rany i przywrÃ³ci wszystkie punkty Å¼ycia. W przypadku wioski magÃ³w naleÅ¼y napiÄ siÄ uzdrawiajÄcej wody ze studni. Po odzyskaniu wszystkich punktÃ³w Å¼ycia, moÅ¼esz dalej kontynuowaÄ swojÄ walkÄ.'
    ],
    6:[ // ded
      {t:_t('t_6.0', null, 'tutorials'), a:'l', hs:'#life1', fs: '#life1', nolight:true}
      //'ZostaÅeÅ pokonany! Ale nie martw siÄ! Na poczÄtku kaÅ¼dy ma wzloty i upadki. Za chwilÄ znowu siÄ ockniesz. PamiÄtaj, by zaraz po tym pobiec do uzdrowiciela!'
    ],
    7:[ // sklep
      {t:_t('t_7.0', null, 'tutorials'), a:'l', hs: '#gold', fs: '#gold'},
      //'ZdecydowaÅeÅ siÄ na zakupy? Najpierw musisz zdobyÄ zÅoto. Aby przenieÅÄ przedmiot ze swojego plecaka do sklepu naleÅ¼y na niego kliknÄÄ. Pojawi siÄ wtedy w polu sprzedaÅ¼. Po akceptacji przedmioty zostanÄ sprzedane. IloÅÄ zÅota podana jest pod paskiem zdrowia i doÅwiadczenia.'
      {t:_t('t_7.1', null, 'tutorials')},
      //'JeÅli masz juÅ¼ doÅÄ zÅota, warto byÅoby coÅ wybraÄ. Zacznij od broni i pancerza. ZwrÃ³Ä uwagÄ, Å¼e przedmioty wymagajÄ konkretnego poziomu doÅwiadczenia i wybierz takie, ktÃ³rych bÄdziesz mÃ³gÅ uÅ¼ywaÄ.'
      {t:_t('t_7.2', null, 'tutorials'), ha:[524,105,115,147]},
      //'Aby zaÅoÅ¼yÄ broÅ lub pancerz naleÅ¼y przedmiot przeciÄgnÄÄ na odpowiedni kwadracik znajdujÄcy siÄ nad ekwipunkiem. PamiÄtaj, Å¼e do Åuku musisz posiadaÄ strzaÅy!'
      {t:_t('t_7.3', null, 'tutorials'), a:'l', hs:'#stats'}
      //'DziÄki broni i pancerzowi bÄdziesz mÃ³gÅ walczyÄ z silniejszymi zwierzÄtami, przez co bÄdziesz zdobywaÅ wiÄcej doÅwiadczenia i otrzymywaÅ mniejsze obraÅ¼enia.'
    ],
    8:[ // quest
      {t:_t('t_8.0', null, 'tutorials'), a:'l', fs: '#b_quests', hs: '#b_quests'}
      //'Wspaniale! OtrzymaÅeÅ zadanie do wykonania! Aby zobaczyÄ wskazÃ³wki naleÅ¼y wybraÄ przycisk Aktywne questy znajdujÄcy siÄ nad ekwipunkiem. PostÄpuj wedÅug nich, a na pewno otrzymasz nagrodÄ i doÅwiadczenie za swÃ³j wysiÅek!'
    ],
    9:[ // za sÅaby na inne mapki
      {t:_t('t_9.0', null, 'tutorials')}
      //'UwaÅ¼aj! Na tutejszych bezdroÅ¼ach moÅ¼esz natknÄÄ siÄ na przeraÅ¼ajÄce potwory i niebezpieczne zwierzÄta! Lepiej wrÃ³Ä do wioski, nabierz siÅ i doÅwiadczenia, a wtedy caÅy Åwiat stanie przed TobÄ otworem!'
    ],
    10:[ // otwarcie mapy
      {t:_t('t_10.0', null, 'tutorials')},
      //'Mapa w krainie Margonem jest jednym z najwaÅ¼niejszych narzÄdzi, jakich bÄdziesz uÅ¼ywaÅ w swoich podrÃ³Å¼ach! MigajÄcy obszar oznacza lokacjÄ, w ktÃ³rej siÄ znajdujesz obecnie.'
      {t:_t('t_10.1', null, 'tutorials')}
      //'Jednak moÅ¼esz wybraÄ mapÄ bieÅ¼Äcej lokacji np.: by znaleÅºÄ z niej wyjÅcie. Twoja pozycja bÄdzie oznaczona czerwonÄ kropkÄ. Lista lokacji pomoÅ¼e odnaleÅºÄ Ci miejsce o konkretnej nazwie na mapie.'
    ],
    11:[ //otwarcie klanÃ³w
      {t:_t('t_11.0', null, 'tutorials')}
      //'Gracze w krainie Margonem mogÄ zrzeszaÄ siÄ w klany. Tutaj moÅ¼esz obejrzeÄ ich strony gÅÃ³wne oraz listy czÅonkÃ³w. JeÅli bÄdziesz czÅonkiem klanu tutaj znajdziesz dodatkowe moÅ¼liwoÅci, jakie daje klan.'
    ],
    12:[ //otwarcie przyjaciÃ³Å
      {t:_t('t_12.0', null, 'tutorials')},
      //'To coÅ bardzo ciekawego! Tutaj moÅ¼esz dodawaÄ osoby, ktÃ³re uwaÅ¼asz za przyjaciÃ³Å lub wrogÃ³w, wpisujÄc ich nicki i naciskajÄc plusa. Przyjaciel bÄdzie musiaÅ wyraziÄ zgodÄ, by znaleÅºÄ siÄ na Twojej liÅcie.'
      {t:_t('t_12.1', null, 'tutorials')}
      //'DziÄki tej liÅcie, wiesz gdzie sÄ Twoi przyjaciele lub kiedy ostatnio byli w grze. Za to wrogowie nie mogÄ wysyÅaÄ do Ciebie wiadomoÅci, ani pisaÄ prywatnie.'
    ],
    13:[ //otwarcie dodatkÃ³w
      {t:_t('t_13.0', null, 'tutorials')}
      //'W Margonem moÅ¼na tworzyÄ wÅasne dodatki do gry w bibliotece jQuery. To bardzo ciekawa funkcja. Warto o tym poczytaÄ na forum.'
    ],
    14:[ //ustawienie kursora w czacie
      {t:_t('t_14.0', null, 'tutorials')},
      //'No nieÅºle! Chcesz otworzyÄ siÄ na innych? Czat umoÅ¼liwia komunikowanie siÄ z graczami przebywajÄcymi w tym samym miejscu co Ty. Aby zaczÄÄ pisaÄ na czacie ogÃ³lnym wystarczy nacisnÄÄ Enter.'
      {t:_t('t_14.1', null, 'tutorials')},
      //'NaciskajÄc przycisk Chat lub literÄ C, zmieniasz rozmiar czatu, do takiego jaki w danej chwili Ci odpowiada. '
      {t:_t('t_14.2', null, 'tutorials')},
      //'Aby napisaÄ prywatnÄ wiadomoÅÄ do kogoÅ naleÅ¼y na czacie zaczÄÄ od @nick. JeÅli chcesz napisaÄ do czÅonkÃ³w swojego klanu, zaczynasz od /k.'
      {t:_t('t_14.3', null, 'tutorials')}
      //'PamiÄtaj! Za nieodpowiednie sÅownictwo, Å¼ebranie i wulgaryzmy, dostÄp do czatu ogÃ³lnego moÅ¼e zostaÄ czasowo zablokowany!'
    ],
    15:[ //wejÅcie na mapkÄ pvp
      {t:_t('t_15.0', null, 'tutorials'), a:'t', hs:'#pvpmode', fs:'#pvpmode'},
      //'W krainie Margonem sÄ rÃ³Å¼ne rodzaje lokacji. Obecnie znajdowaÅeÅ siÄ w lokacjach zielonych, w ktÃ³rych nie moÅ¼e CiÄ nikt zaatakowaÄ. IstniejÄ jeszcze lokacje: Å¼Ã³Åte, czerwone i pomaraÅczowe.'
      {t:_t('t_15.1', null, 'tutorials'), a:'t', hs:'#b_pvp', fs:'#b_pvp'},
      //'W lokacji Å¼Ã³Åtej istnieje moÅ¼liwoÅÄ walki, jeÅli dwaj gracze wyraÅ¼Ä na niÄ zgodÄ. Zgoda wyraÅ¼ana jest przez ustawienie mieczy, odmowa przez ustawienie tarczy.'
      {t:_t('t_15.2', null, 'tutorials')},
      //'W czerwonych lokacjach gracze mogÄ walczyÄ ze sobÄ w kaÅ¼dym przypadku, niezaleÅ¼nie od ustawienia tarczy lub mieczy.'
      {t:_t('t_15.3', null, 'tutorials')}
      //'PomaraÅczowa lokacja to arena. MoÅ¼esz na niej sprÃ³bowaÄ siÅ z innymi graczami. JeÅli przegrasz pojawiasz siÄ znowu na tej arenie po kilku sekundach. Arena jest w kaÅ¼dym mieÅcie.'
    ],
    16:[ //25 poziom
      {t:_t('t_16.0', null, 'tutorials'), a:'l', hs:'#base3'},
      //'Brawo! MoÅ¼na juÅ¼ powiedzieÄ, Å¼e jesteÅ doÅwiadczonym graczem! Od teraz bÄdziesz mÃ³gÅ sam rozdawaÄ 1 punkt statystyk wedle uznania i moÅ¼esz zaczÄÄ uczyÄ siÄ umiejÄtnoÅci.'
      {t:_t('t_16.1', null, 'tutorials'), a:'l', hs:'#b_skills', fs:'#b_skills'},
      //'UmiejÄtnoÅci to specjalne sposoby walki zaleÅ¼ne od profesji i poziomu. DzielÄ siÄ na: DrogÄ SiÅy,  DrogÄ Sprytu, DrogÄ Å»ywioÅÃ³w i DrogÄ ÅwiatÅoÅci..'
      {t:_t('t_16.2', null, 'tutorials')},
      //'Nauczyciele umiejÄtnoÅci znajdujÄ siÄ w rÃ³Å¼nych miejscach: kowal Aberyt uczy Drogi SiÅy i jest w swojej kuÅºni w PrzedmieÅciach Karka-han.'
      {t:_t('t_16.3', null, 'tutorials')}
      //'Drogi Sprytu uczy Åowca Szagarat z Torneg, DrogÄ Å»ywioÅÃ³w zajmuje siÄ mag Jaren z BarakÃ³w w Ithan, a DrogÄ ÅwiatÅoÅci zna paladyn sir William z Ratusza Karka-han.'
    ],
    17:[ //otrzymanie zapro do handlu,klanu,przyjaciÃ³l
      {t:_t('t_17.0', null, 'tutorials')}
      //'Inni gracze mogÄ zapraszaÄ CiÄ do klanÃ³w, listy przyjaciÃ³Å lub handlu. JeÅli przeszkadzajÄ Ci takie komunikaty, moÅ¼esz je zablokowaÄ w Konfiguracji. Znajdziesz tam rÃ³wnieÅ¼ inne funkcje.', hs:'#b_config'
    ],
    18:[ // gracz rozpoczal pierwszy dialog, czesc II
      {t:_t('t_18.0', null, 'tutorials'), hs: '.gw', callback:function(){Highlighter.startG.synchroStart('tutorial');}}
      //'JesteÅ gotowy, aby zobaczyÄ wioskÄ! StaÅ na ikonie drzwi, naciÅnij lewym przyciskiem myszy na swojÄ postaÄ i wybierz PrzejdÅº.'
    ],
    19:[ //pokazaÅ siÄ button do automatycznej walki
      {t:_t('t_19.0', null, 'tutorials'), a:'l', hs: '#autobattleButton', fs: '#autobattleButton'}
      //'MoÅ¼esz szubko zakoÅczyÄ walkÄ klikajÄc przycisk auto. Powoduje on przejÅcie walki w tryb automatyczny i szybsze jej dokoÅczenie. SkrÃ³t: A'
    ],
    20:[ //pierwszy sklep
      {t:_t('t_20.0', null, 'tutorials'), a:'r', hs:'#shop_store'},
      {t:_t('t_20.1', null, 'tutorials'), a:'b', hs:'#shop_buy'},
      {t:_t('t_20.2', null, 'tutorials'), a:'t', hs:'#shop_sell'},
      {t:_t('t_20.3', null, 'tutorials'), a:'l', hs:'#bagc'},
    ],
    21:[ //gracz odwiedza lokacje 2,9,35 - pierwsze miasta po wyjÅciu z wioski startowej
      {t:_t('t_21.0', null, 'tutorials')},
      {t:_t('t_21.1', null, 'tutorials')},
    ]
  }
}