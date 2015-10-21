(function(){function index(it
/**/) {
var out='<!DOCTYPE html><html> <head> <meta charset="utf-8" /> <meta name="viewport" content="width=device-width" /> <title>아즈인포 뷰어 - '+( it.basic.name)+'</title> <link rel="stylesheet" href="css/user.css" /> <link rel="stylesheet" href="css/core.css" /> <script src="js/front.js"></script> <script src="js/list-1.1.1.js"></script> <script src="js/lazyload.min.js"></script> </head> <body id="body"> <header> <div class="header"> <a href="/"><b>아즈인포</b> 뷰어</a> <span class="nickname">'+( it.name || '공백닉 ㅁㅊ;')+'</span> '; if (it.basic.error) { out+=' <span class="notice"> 폭룡천인데 에러가 뜬다면 <a href="http://sdvx.azu.kr/system/control">갱신을 시도</a>해주세요 </span> '; } out+=' <div class="buttons"> <!--input type="text" id="moveto_id" /> <a href="/404">이동</a--> <a href="http://sdvx.azu.kr/system/control">갱신</a> <a href="http://sdvx.azu.kr/system/register/">등록</a> </div> </div> <div class="profile"> <div> '; if (it.basic.error) { out+=' <a href="http://sdvx.azu.kr/system/control" title="아즈인포 버그가 해결되었습니다만 갱신해야 반영됩니다"> <div class="skill-level" data-skill-level="12"> <span class="skill-level-title"> 에러 </span> </div> </a> '; } else { out+=' <div class="skill-level" data-skill-level="'+( it.basic.skill_no)+'"> <span class="skill-level-title"> '+( it.basic.skill_name)+' </span> </div> '; } out+=' <h1 class="username"> '+( it.basic.name)+' </h1> <div class="userdata-detail"> 플레이 <span id="playcount">'+( it.basic.play)+'</span> 패킷 <span id="packet">'+( it.basic.packet)+'</span> 블럭 <span id="block">'+( it.basic.block)+'</span> </div> </div> </div> <input type="checkbox" id="overview-toggle" class="hidden" /> <label class="overview-header" for="overview-toggle"> <span class="triangle"> </span> 전체 통계 </label> <div class="overview"> <table> <thead> <tr> <th></th> <th style="color: #ff9;">AAA</th> <th style="color: #ff9;">AA</th> <th style="color: #ff9;">A</th> <th>B</th> <th>C</th> <th>D</th> <th><span class="song-clear" data-clear="0"></span></th> <th><span class="song-clear" data-clear="1"></span></th> <th><span class="song-clear" data-clear="2"></span></th> <th><span class="song-clear" data-clear="3"></span></th> <th><span class="song-clear" data-clear="4"></span></th> <th>Total</th> <th style="width: 14.285714286%">Avg</th> </tr> </thead> <tbody> ';var arr1=it.overview;if(arr1){var value,index=-1,l1=arr1.length-1;while(index<l1){value=arr1[index+=1];out+=' <tr> <th>'+( index + 1 )+'</th> '; for(var i in value.lamp) { out+=' <td>'+( value.lamp[i] || '' )+'</td> '; } out+=' <td>'+( value.count )+'</td> <td>'+( it.fn.score(~~(value.leveltotal / value.count)) )+'</td> </tr> ';} } out+=' </tbody> </table> </div> </header> <nav> <div class="nav-heading"> <select id="find-level" onchange="filter()"> <option value="">레벨</option> <option value=" 1 ">1</option> <option value=" 2 ">2</option> <option value=" 3 ">3</option> <option value=" 4 ">4</option> <option value=" 5 ">5</option> <option value=" 6 ">6</option> <option value=" 7 ">7</option> <option value=" 8 ">8</option> <option value=" 9 ">9</option> <option value=" 10 ">10</option> <option value=" 11 ">11</option> <option value=" 12 ">12</option> <option value=" 13 ">13</option> <option value=" 14 ">14</option> <option value=" 15 ">15</option> <option value=" 16 ">16</option> </select> | <select id="find-rank" onchange="filter()"> <option value="">랭크</option> <option value=" 5 ">AAA</option> <option value=" 4 ">AA</option> <option value=" 3 ">A</option> <option value=" 2 ">B</option> <option value=" 1 ">C</option> <option value=" 0 ">D</option> </select> | <select id="find-clear" onchange="filter()"> <option value="">클리어</option> <option value=" 0 ">Fail</option> <option value=" 1 ">Clear</option> <option value=" 2 ">HC</option> <option value=" 3 ">UC</option> <option value=" 4 ">PUC</option> </select> <a href="#" class="like-select" style="float: right;" onclick="resetNav()"> <svg width="20" height="24" style="width:1.25em;height:1em;"> <path d="M0,8l5-8h15v16H5L0,8z M15.4,10.6L12.7,8l2.6-2.6l-0.7-0.7L12,7.3L9.4,4.6L8.6,5.4L11.3,8l-2.6,2.6l0.7,0.7L12,8.7l2.6,2.6L15.4,10.6z" fill="#ddd" /> </svg> </a> </div> <div class="pattern nov"> <select id="sort-nov" onchange="sort(\'nov\', this.value)"> <option value="default">-</option> <option value="level/asc">레벨 ▲</option> <option value="level/desc">레벨 ▼</option> <option value="score/asc">점수 ▲</option> <option value="score/desc">점수 ▼</option> <option value="clear/asc">클리어 ▲</option> <option value="clear/desc">클리어 ▼</option> <option value="rank/asc">랭크 ▲</option> <option value="rank/desc">랭크 ▼</option> <option value="played/asc">플레이카운트 ▲</option> <option value="played/desc">플레이카운트 ▼</option> <option value="clearrate/asc">클리어율 ▲</option> <option value="clearrate/desc">클리어율 ▼</option> </select> </div><!-- --><div class="pattern adv"> <select id="sort-adv" onchange="sort(\'adv\', this.value)"> <option value="default">-</option> <option value="level/asc">레벨 ▲</option> <option value="level/desc">레벨 ▼</option> <option value="score/asc">점수 ▲</option> <option value="score/desc">점수 ▼</option> <option value="clear/asc">클리어 ▲</option> <option value="clear/desc">클리어 ▼</option> <option value="rank/asc">랭크 ▲</option> <option value="rank/desc">랭크 ▼</option> <option value="played/asc">플레이카운트 ▲</option> <option value="played/desc">플레이카운트 ▼</option> <option value="clearrate/asc">클리어율 ▲</option> <option value="clearrate/desc">클리어율 ▼</option> </select> </div><!-- --><div class="pattern exh"> <select id="sort-exh" onchange="sort(\'exh\', this.value)"> <option value="default">-</option> <option value="level/asc">레벨 ▲</option> <option value="level/desc">레벨 ▼</option> <option value="score/asc">점수 ▲</option> <option value="score/desc">점수 ▼</option> <option value="clear/asc">클리어 ▲</option> <option value="clear/desc">클리어 ▼</option> <option value="rank/asc">랭크 ▲</option> <option value="rank/desc">랭크 ▼</option> <option value="played/asc">플레이카운트 ▲</option> <option value="played/desc">플레이카운트 ▼</option> <option value="clearrate/asc">클리어율 ▲</option> <option value="clearrate/desc">클리어율 ▼</option> </select> </div><!-- --><div class="pattern inf"> <select id="sort-ext" onchange="sort(\'ext\', this.value)"> <option value="default">-</option> <option value="level/asc">레벨 ▲</option> <option value="level/desc">레벨 ▼</option> <option value="score/asc">점수 ▲</option> <option value="score/desc">점수 ▼</option> <option value="clear/asc">클리어 ▲</option> <option value="clear/desc">클리어 ▼</option> <option value="rank/asc">랭크 ▲</option> <option value="rank/desc">랭크 ▼</option> <option value="played/asc">플레이카운트 ▲</option> <option value="played/desc">플레이카운트 ▼</option> <option value="clearrate/asc">클리어율 ▲</option> <option value="clearrate/desc">클리어율 ▼</option> </select> </div> </nav> <main> <ul class="list" id="list"> ';var arr2=it.body;if(arr2){var song,index=-1,l2=arr2.length-1;while(index<l2){song=arr2[index+=1];out+=' <li class="song-column"> <div class="song-title"> <h2 class="title"> '+( song.title)+' </h2> <h3 class="artist"> '+( song.artist)+' </h3> </div><!-- NOV --><div class="pattern nov"> <img class="albumart lazy-load" data-src="http://sdvx.azu.kr/albumart/'+( song.d[0].illust )+'.jpg" src="data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=" alt="'+( song.title)+' NOVICE"/><noscript> <img class="albumart" src="http://sdvx.azu.kr/albumart/'+( song.d[0].illust )+'.jpg" alt="'+( song.title)+' NOVICE"/> </noscript><div class="upper"> <span class="song-level list-nov-level"> '+( song.d[0].level || '')+' </span> <span class="song-rank" data-rank="'+( song.d[0].rank )+'"> </span> <span class="list-rank list-nov-rank hidden"> '+( song.d[0].rank )+' </span> </div><!-- --><div class="middle"><!-- --><span class="playcount-played list-nov-played">'+( song.d[0].play || 0 )+'</span><!-- --><span class="playcount-cleared list-nov-cleared">'+( song.d[0].clear || 0 )+'</span><!-- --><span class="playcount-uc list-nov-uc">'+( song.d[0].ultimate || 0 )+'</span><!-- --><span class="playcount-perfect list-nov-perfect">'+( song.d[0].perfect || 0 )+'</span> <span class="hidden list-nov-clearrate">'+( it.fn.zfill(song.d[0].clear / song.d[0].play * 100) )+'</span> </div><!-- --><div class="lower"> <span class="song-clear list-nov-clear" data-clear="'+( song.d[0].cleartype )+'"> </span> <span class="list-nov-clear hidden"> '+( (song.d[0].cleartype === undefined) ? '' : song.d[0].cleartype )+' </span> <span class="song-score list-nov-score"> '+( it.fn.score(song.d[0].score || '') )+' </span> </div> </div><!-- ADV --><div class="pattern adv"> <img class="albumart lazy-load" data-src="http://sdvx.azu.kr/albumart/'+( song.d[1].illust )+'.jpg" src="data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=" alt="'+( song.title)+' ADVANCED" /><noscript> <img class="albumart" src="http://sdvx.azu.kr/albumart/'+( song.d[1].illust )+'.jpg" alt="'+( song.title)+' ADVANCED" /> </noscript><div class="upper"> <span class="song-level list-adv-level"> '+( song.d[1].level || '')+' </span> <span class="song-rank" data-rank="'+( song.d[1].rank )+'"> </span> <span class="list-rank list-adv-rank hidden"> '+( song.d[1].rank )+' </span> </div><!-- --><div class="middle"><!-- --><span class="playcount-played list-adv-played">'+( song.d[1].play || 0 )+'</span><!-- --><span class="playcount-cleared list-adv-cleared">'+( song.d[1].clear || 0 )+'</span><!-- --><span class="playcount-uc list-adv-uc">'+( song.d[1].ultimate || 0 )+'</span><!-- --><span class="playcount-perfect list-adv-perfect">'+( song.d[1].perfect || 0 )+'</span> <span class="hidden list-adv-clearrate">'+( it.fn.zfill(song.d[1].clear / song.d[1].play * 100) )+'</span> </div><!-- --><div class="lower"> <span class="song-clear" data-clear="'+( song.d[1].cleartype )+'"> </span> <span class="list-adv-clear hidden"> '+( (song.d[1].cleartype === undefined) ? '' : song.d[1].cleartype )+' </span> <span class="song-score list-adv-score"> '+( it.fn.score(song.d[1].score || '') )+' </span> </div> </div><!-- EXH --><div class="pattern exh"> <img class="albumart lazy-load" data-src="http://sdvx.azu.kr/albumart/'+( song.d[2].illust )+'.jpg" src="data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=" alt="'+( song.title)+' EXHAUST" /><noscript> <img class="albumart" src="http://sdvx.azu.kr/albumart/'+( song.d[2].illust )+'.jpg" alt="'+( song.title)+' EXHAUST" /> </noscript><div class="upper"> <span class="song-level list-exh-level"> '+( song.d[2].level || '')+' </span> <span class="song-rank" data-rank="'+( song.d[2].rank )+'"> </span> <span class="list-rank list-exh-rank hidden"> '+( song.d[2].rank )+' </span> </div><!-- --><div class="middle"><!-- --><span class="playcount-played list-exh-played">'+( song.d[2].play || 0 )+'</span><!-- --><span class="playcount-cleared list-exh-cleared">'+( song.d[2].clear || 0 )+'</span><!-- --><span class="playcount-uc list-exh-uc">'+( song.d[2].ultimate || 0 )+'</span><!-- --><span class="playcount-perfect list-exh-perfect">'+( song.d[2].perfect || 0 )+'</span> <span class="hidden list-exh-clearrate">'+( it.fn.zfill(song.d[2].clear / song.d[2].play * 100) )+'</span> </div><!-- --><div class="lower"> <span class="song-clear" data-clear="'+( song.d[2].cleartype )+'"> </span> <span class="list-exh-clear hidden"> '+( (song.d[2].cleartype === undefined) ? '' : song.d[2].cleartype )+' </span> <span class="song-score list-exh-score"> '+( it.fn.score(song.d[2].score || '') )+' </span> </div> </div><!-- EXTRA --><div class="pattern pattern-extra '+( song.last || '')+'"> ';if(song.d[3]){out+=' <img class="albumart lazy-load" data-src="http://sdvx.azu.kr/albumart/'+( song.d[3].illust )+'.jpg" src="data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=" alt="'+( song.title)+' INFINITE/GRAVITY" /><noscript> <img class="albumart" src="http://sdvx.azu.kr/albumart/'+( song.d[3].illust )+'.jpg" alt="'+( song.title)+' INFINITE/GRAVITY" /> </noscript><div class="upper"> <span class="song-level list-ext-level"> '+( song.d[3].level || '')+' </span> <span class="song-rank" data-rank="'+( song.d[3].rank )+'"> </span> <span class="list-rank list-ext-rank hidden"> '+( song.d[3].rank )+' </span> </div><!-- --><div class="middle"><!-- --><span class="playcount-played list-ext-played">'+( song.d[3].play || 0 )+'</span><!-- --><span class="playcount-cleared list-ext-cleared">'+( song.d[3].clear || 0 )+'</span><!-- --><span class="playcount-uc list-ext-uc">'+( song.d[3].ultimate || 0 )+'</span><!-- --><span class="playcount-perfect list-ext-perfect">'+( song.d[3].perfect || 0 )+'</span> <span class="hidden list-ext-clearrate">'+( it.fn.zfill(song.d[3].clear / song.d[3].play * 100) )+'</span> </div><!-- --><div class="lower"> <span class="song-clear" data-clear="'+( song.d[3].cleartype )+'"> </span> <span class="list-ext-clear hidden"> '+( (song.d[3].cleartype === undefined) ? '' : song.d[3].cleartype )+' </span> <span class="song-score list-ext-score"> '+( it.fn.score(song.d[3].score || '') )+' </span> </div> ';}out+=' </div> </li> ';} } out+=' </ul> </main> <script src="/js/ga.js"></script> </body></html>';return out;
}var itself=index, _encodeHTML=(function (doNotSkipEncoded) {
		var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;", "/": "&#47;" },
			matchHTML = doNotSkipEncoded ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
		return function(code) {
			return code ? code.toString().replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : "";
		};
	}());if(typeof module!=='undefined' && module.exports) module.exports=itself;else if(typeof define==='function')define(function(){return itself;});else {window.render=window.render||{};window.render['index']=itself;}}());