/* Paste your Formspree endpoint below to turn on automatic receipt emails.
   Leave it blank to use the email-app fallback. */
const ORGANIZER_EMAIL = 'tannookieman@gmail.com';
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xaewalgd';

const state = { date:'', time:'', type:'', idea:'', foodCategory:'', custom:'', foodCustom:'', declineReason:'' };
const dateTypes = [
  { id:'food', emoji:'🍽️', label:'Food & treats' },
  { id:'outdoor', emoji:'☀️', label:'Something outside' },
  { id:'chill', emoji:'🛋️', label:'Just chill together' },
  { id:'indoor', emoji:'🎳', label:'An indoor activity' }
];
const ideas = {
  outdoor:['Hang out at a park','Go to the beach','Take a scenic walk','Visit a farmers market','Mini golf outside'],
  chill:['Coffee and a good chat','Movie night','Board games','Browse a bookstore','Sunset drive'],
  indoor:['Bowling','Arcade games','Museum or gallery','Escape room','Pottery or paint class']
};
const foods = {
  Mexican:['Tacos','Burritos','A sit-down Mexican restaurant'], Italian:['Pizza','Pasta','A cozy Italian restaurant'],
  'Fast food':['Classic burgers and fries','Chicken sandwiches','Late-night drive-through'], Treats:['Cake','Ice cream','A bakery shop','Boba or smoothies'],
  Brunch:['Pancakes','Avocado toast','A brunch café'], Asian:['Sushi','Ramen','Thai food']
};
const $ = s => document.querySelector(s);
const screens = { invite:'inviteScreen', confirmNo:'confirmNoScreen', declineReason:'declineReasonScreen', schedule:'scheduleScreen', dateType:'dateTypeScreen', idea:'ideaScreen', foodCategory:'foodCategoryScreen', foodIdea:'foodIdeaScreen', review:'reviewScreen', sent:'sentScreen' };
let current = 'invite';
let reviewOrigin = 'dateType';
function show(name){ current=name; document.querySelectorAll('.screen').forEach(x=>x.classList.remove('active')); $('#'+screens[name]).classList.add('active'); const p={invite:0,confirmNo:0,declineReason:0,schedule:25,dateType:50,idea:75,foodCategory:75,foodIdea:88,review:100,sent:100}; $('#progressFill').style.width=p[name]+'%'; window.scrollTo({top:0,behavior:'smooth'}); }
document.addEventListener('click', e=>{ const target=e.target.closest('[data-go]'); if(target) show(target.dataset.go); });

function renderTypes(){ $('#dateTypes').innerHTML=dateTypes.map(x=>`<button class="choice ${state.type===x.id?'selected':''}" data-type="${x.id}"><span class="emoji">${x.emoji}</span><span>${x.label}</span></button>`).join(''); }
function renderFoodCategories(){ $('#foodCategories').innerHTML=Object.keys(foods).map(x=>`<button class="choice ${state.foodCategory===x?'selected':''}" data-food-category="${x}">${x}</button>`).join(''); }
$('#dateTypes').addEventListener('click',e=>{let b=e.target.closest('[data-type]');if(!b)return;state.type=b.dataset.type;state.custom='';$('#customPlan').value='';renderTypes();});
$('#foodCategories').addEventListener('click',e=>{let b=e.target.closest('[data-food-category]');if(!b)return;state.foodCategory=b.dataset.foodCategory;state.foodCustom='';$('#foodCustom').value='';renderFoodCategories();});

function formatDate(){ return new Date(state.date+'T12:00:00').toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric',year:'numeric'}); }
function formatTime(){ return new Date('2000-01-01T'+state.time).toLocaleTimeString([], {hour:'numeric',minute:'2-digit'}); }
function context(){ const d=new Date(state.date+'T12:00:00'); const day=d.toLocaleDateString(undefined,{weekday:'long'}); const hour=+state.time.split(':')[0]; const period=hour<12?'morning':hour<17?'afternoon':'evening'; return `A ${day} ${period} sounds lovely. Pick what feels most like you.`; }
$('#scheduleNext').onclick=()=>{state.date=$('#dateInput').value;state.time=$('#timeInput').value;$('#scheduleError').hidden=!!(state.date&&state.time);if(!state.date||!state.time)return;$('#dateContext').textContent=context();renderTypes();show('dateType');};
$('#typeNext').onclick=()=>{state.custom=$('#customPlan').value.trim();$('#typeError').hidden=!!(state.type||state.custom);if(!state.type&&!state.custom)return;if(state.custom){state.idea='';showReview('dateType');return;}if(state.type==='food'){renderFoodCategories();show('foodCategory');return;}renderIdeas();show('idea');};
function renderIdeas(){ const label=dateTypes.find(x=>x.id===state.type).label;$('#ideaTitle').textContent=label==='Something outside'?'Get out there.':'Choose your favorite.';$('#ideaContext').textContent=`Some ${label.toLowerCase()} ideas for ${formatDate()} at ${formatTime()}.`;$('#ideas').innerHTML=ideas[state.type].map(x=>`<button class="idea ${state.idea===x?'selected':''}" data-idea="${x}">${x}</button>`).join(''); }
$('#ideas').addEventListener('click',e=>{let b=e.target.closest('[data-idea]');if(!b)return;state.idea=b.dataset.idea;$('#ideaCustom').value='';$('#ideas').querySelectorAll('.idea').forEach(x=>x.classList.toggle('selected',x===b));});
$('#ideaNext').onclick=()=>{const c=$('#ideaCustom').value.trim();if(c)state.custom=c;$('#ideaError').hidden=!!(state.idea||state.custom);if(state.idea||state.custom)showReview('idea');};
$('#foodCategoryNext').onclick=()=>{state.foodCustom=$('#foodCustom').value.trim();$('#foodCategoryError').hidden=!!(state.foodCategory||state.foodCustom);if(!state.foodCategory&&!state.foodCustom)return;if(state.foodCustom){state.custom=state.foodCustom;state.idea='';showReview('foodCategory');return;}renderFoodIdeas();show('foodIdea');};
function renderFoodIdeas(){ $('#foodIdeaContext').textContent=`For ${state.foodCategory.toLowerCase()}, what sounds best?`;$('#foodIdeas').innerHTML=foods[state.foodCategory].map(x=>`<button class="idea ${state.idea===x?'selected':''}" data-food-idea="${x}">${x}</button>`).join(''); }
$('#foodIdeas').addEventListener('click',e=>{let b=e.target.closest('[data-food-idea]');if(!b)return;state.idea=b.dataset.foodIdea;$('#foodIdeaCustom').value='';$('#foodIdeas').querySelectorAll('.idea').forEach(x=>x.classList.toggle('selected',x===b));});
$('#foodIdeaNext').onclick=()=>{const c=$('#foodIdeaCustom').value.trim();if(c)state.custom=c;$('#foodIdeaError').hidden=!!(state.idea||state.custom);if(state.idea||state.custom)showReview('foodIdea');};
function planDescription(){if(state.custom)return state.custom;if(state.type==='food')return `${state.foodCategory} — ${state.idea}`;return `${dateTypes.find(x=>x.id===state.type).label} — ${state.idea}`;}
function showReview(origin){ reviewOrigin=origin; $('#receipt').innerHTML=`<div class="receipt-row"><span class="receipt-label">When</span><span class="receipt-value">${formatDate()} at ${formatTime()}</span></div><div class="receipt-row"><span class="receipt-label">Date category</span><span class="receipt-value">${state.custom?'Something specific':dateTypes.find(x=>x.id===state.type)?.label}</span></div><div class="receipt-row"><span class="receipt-label">The plan</span><span class="receipt-value">${planDescription()}</span></div>`;show('review'); }
$('#reviewBack').onclick=()=>show(reviewOrigin);
function receiptText(status='Date plan'){return `${status}\n\nDate: ${formatDate()}\nTime: ${formatTime()}\nCategory: ${state.custom?'Something specific':dateTypes.find(x=>x.id===state.type)?.label}\nPlan: ${planDescription()}`;}
async function submitReceipt(subject,body){
  if(FORMSPREE_ENDPOINT){
    const response=await fetch(FORMSPREE_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({subject,message:body})});
    if(!response.ok)throw new Error('The receipt could not be delivered. Please try again.');
    return 'automatic';
  }
  const href=`mailto:${ORGANIZER_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href=href;
  return 'email-app';
}
$('#submitPlan').onclick=async()=>{if(!$('#confirmSubmit').checked){$('#submitError').hidden=false;return;}try{const delivery=await submitReceipt('New date plan',receiptText('New date plan ✦'));$('#sentMessage').textContent=delivery==='automatic'?'Your plan was sent to the organizer. Can’t wait!':'Your email app has opened with the receipt ready to send. Can’t wait!';$('#sentCard').textContent=`${formatDate()} · ${formatTime()}\n${planDescription()}`;show('sent');}catch(error){$('#submitError').textContent=error.message;$('#submitError').hidden=false;}};
$('#submitDecline').onclick=async()=>{const reason=$('#declineReason').value.trim();const sentence=/[.!?](?:\s|$)/.test(reason) || reason.split(/\s+/).length>=8;$('#reasonNote').classList.toggle('error',!sentence);if(!sentence){$('#reasonNote').textContent='Please write at least one complete sentence.';return;}try{const delivery=await submitReceipt('Date invitation response',`Response: No\n\nReason: ${reason}`);$('#sentTitle').textContent='Thank you.';$('#sentMessage').textContent=delivery==='automatic'?'Your response was sent respectfully.':'Your email app has opened with your response ready to send.';$('#sentCard').textContent='Your honest response matters.';show('sent');}catch(error){$('#reasonNote').textContent=error.message;$('#reasonNote').classList.add('error');}};
$('#copyReceipt').onclick=async()=>{try{await navigator.clipboard.writeText(receiptText('My date plan'));$('#copyReceipt').textContent='Copied!';}catch{ $('#copyReceipt').textContent='Select and copy the details above'; }};
const today=new Date();$('#dateInput').min=today.toISOString().slice(0,10);
