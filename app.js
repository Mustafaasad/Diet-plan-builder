/* ====================== SUPABASE SETUP ====================== */
const SUPABASE_URL = "https://fspcemuqtallvhkhnort.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzcGNlbXVxdGFsbHZoa2hub3J0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4MTk0NDYsImV4cCI6MjA5ODM5NTQ0Nn0.BzLicIC9LlpZslf97yUCZKWJyQIrh-0preW2NBQUbRg";
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let currentUser=null, currentProfile=null;

/* ====================== FOOD DATABASE (USDA-based, per ref qty) ======================
   [name, category, unit, refQty, Protein, Carbs, Fats, Calories]   macros are per refQty units */
const FOODS_RAW = [
["Beef (lean), raw","Protein","g",100,20,0,10,176],
["Beef mince (lean), raw","Protein","g",100,20,0,10,176],
["Beef mince (regular), raw","Protein","g",100,17,0,20,250],
["Chicken breast (skinless), raw","Protein","g",100,22.5,0,2.6,120],
["Chicken thigh (skinless), raw","Protein","g",100,18,0,8,150],
["Chicken (whole), raw","Protein","g",100,18,0,15,215],
["Cod, raw","Protein","g",100,18,0,0.7,82],
["Egg (whole)","Protein","pc",1,6.3,0.4,4.8,72],
["Egg white","Protein","pc",1,3.6,0.2,0.1,17],
["Egg yolk","Protein","pc",1,2.7,0.6,4.5,55],
["Goat meat, raw","Protein","g",100,27,0,3,109],
["Lamb / Mutton, raw","Protein","g",100,25,0,21,294],
["Mackerel (king), raw","Protein","g",100,21,0,13,200],
["Pangasius, raw","Protein","g",100,15,0,3,90],
["Paneer","Protein","g",100,18,3.6,22,265],
["Prawns / Shrimp, raw","Protein","g",100,20,0,1,99],
["Protein, casein (1 scoop)","Protein","scoop",1,24,3,1,120],
["Protein, hydro whey (1 scoop)","Protein","scoop",1,25,1,0.5,110],
["Protein, whey (1 scoop)","Protein","scoop",1,24,2,1,110],
["Rohu fish, raw","Protein","g",100,17,0,1,97],
["Salmon, raw","Protein","g",100,20,0,13,208],
["Sardine, raw","Protein","g",100,25,0,11,208],
["Sole, raw","Protein","g",100,18,0,1,86],
["Soy chunks (dry)","Protein","g",100,52,33,0.5,345],
["Tilapia, raw","Protein","g",100,20,0,2,96],
["Tofu (firm)","Protein","g",100,8,2,5,76],
["Tuna (canned in water)","Protein","g",100,26,0,1,116],
["Tuna, raw","Protein","g",100,23,0,1,109],
["Turkey breast, raw","Protein","g",100,29,0,1,135],
["Atta / Wheat flour","Carb","g",100,13,72,2,364],
["Bread (brown)","Carb","slice",1,3.5,12,1,75],
["Bread (multigrain)","Carb","slice",1,4,11,1.2,80],
["Bread (white)","Carb","slice",1,2.7,13,1,77],
["Bun (burger)","Carb","pc",1,5.5,28,2.5,150],
["Chickpeas / Chana (cooked)","Carb","g",100,9,27,2.6,164],
["Chickpeas / Chana (dry)","Carb","g",100,19,61,6,364],
["Cornflakes","Carb","g",100,7,84,0.4,357],
["Honey","Carb","tbsp",1,0.1,17,0,64],
["Kidney beans / Rajma (dry)","Carb","g",100,24,60,0.8,333],
["Lentils / Masoor (cooked)","Carb","g",100,9,20,0.4,116],
["Lentils / Masoor (dry)","Carb","g",100,25,60,1,352],
["Maize / Corn flour","Carb","g",100,7,76,4,361],
["Mash daal / Black gram (dry)","Carb","g",100,25,59,1.6,341],
["Moong daal (dry)","Carb","g",100,24,63,1.2,347],
["Naan","Carb","pc",1,9,50,5,290],
["Oats (rolled, dry)","Carb","g",100,13.5,68,7,389],
["Paratha","Carb","pc",1,5,30,12,250],
["Pasta (cooked)","Carb","g",100,5.8,25,0.9,131],
["Pasta (dry)","Carb","g",100,13,75,1.5,371],
["Potato (sweet), raw","Carb","g",100,1.6,20,0.1,86],
["Potato (white), raw","Carb","g",100,2,17,0.1,77],
["Quinoa (cooked)","Carb","g",100,4.4,21,1.9,120],
["Rice (basmati), cooked","Carb","g",100,3.5,25,0.4,121],
["Rice (brown), cooked","Carb","g",100,2.6,23,0.9,112],
["Rice (brown), raw","Carb","g",100,7.9,77,2.9,370],
["Rice (white), cooked","Carb","g",100,2.7,28,0.3,130],
["Rice (white), raw","Carb","g",100,6.8,80,0.7,365],
["Roti / Chapati","Carb","pc",1,3,18,2,104],
["Sugar (white)","Carb","tsp",1,0,4,0,16],
["Vermicelli / Seviyan (dry)","Carb","g",100,12,77,1,370],
["White beans (dry)","Carb","g",100,23,60,0.8,333],
["Almonds","Fat","g",100,21,22,49,579],
["Avocado","Fat","g",100,2,9,15,160],
["Cashews","Fat","g",100,18,30,44,553],
["Chia seeds","Fat","g",100,17,42,31,486],
["Chocolate (dark)","Fat","g",100,7.8,46,43,598],
["Coconut (fresh)","Fat","g",100,3,15,33,354],
["Flaxseeds","Fat","g",100,18,29,42,534],
["Ghee","Fat","tbsp",1,0,0,14,126],
["Oil (canola/vegetable)","Fat","tbsp",1,0,0,14,124],
["Oil (coconut)","Fat","tbsp",1,0,0,13.5,117],
["Oil (olive)","Fat","tbsp",1,0,0,13.5,119],
["Peanut butter","Fat","tbsp",1,4,3,8,94],
["Peanuts","Fat","g",100,26,16,49,567],
["Pine nuts / Chilgoza","Fat","g",100,14,13,68,673],
["Pistachios","Fat","g",100,20,28,45,560],
["Sunflower seeds","Fat","g",100,21,20,51,584],
["Walnuts","Fat","g",100,15,14,65,654],
["Butter","Dairy","tbsp",1,0.1,0,11.5,102],
["Cheese (cheddar)","Dairy","g",100,25,1.3,33,403],
["Cheese (cottage)","Dairy","g",100,11,3.4,4.3,98],
["Cheese (mozzarella)","Dairy","g",100,22,2.2,22,300],
["Cream (sour)","Dairy","g",100,2.4,4.5,19,193],
["Kiri cream cheese (1 portion)","Dairy","portion",1,1,1,6,65],
["Milk (Nesvita low fat)","Dairy","g",100,3.4,5,1,42],
["Milk (Olpers full cream)","Dairy","g",100,3.3,4.7,3.4,60],
["Milk (skim)","Dairy","g",100,3.4,5,0.1,34],
["Milk (whole)","Dairy","g",100,3.4,5,3.6,61],
["Yogurt (Greek, nonfat)","Dairy","g",100,10,3.6,0.4,59],
["Yogurt (Greek, plain)","Dairy","g",100,10,3.6,5,97],
["Yogurt (Nestle)","Dairy","g",100,3.6,5.7,3.5,68.7],
["Yogurt (plain)","Dairy","g",100,3.5,4.7,3.3,61],
["Apple (with skin)","Fruit","g",100,0.3,14,0.2,52],
["Apricot","Fruit","g",100,1.4,11,0.4,48],
["Banana","Fruit","g",100,1.1,23,0.3,89],
["Blueberries","Fruit","g",100,0.7,14,0.3,57],
["Cherries","Fruit","g",100,1.1,16,0.2,63],
["Dates","Fruit","g",100,2,75,0.4,277],
["Figs (fresh)","Fruit","g",100,0.8,19,0.3,74],
["Grapes","Fruit","g",100,0.7,18,0.2,69],
["Guava","Fruit","g",100,2.6,14,1,68],
["Kiwi","Fruit","g",100,1.1,15,0.5,61],
["Lemon","Fruit","g",100,1.1,9,0.3,29],
["Mango","Fruit","g",100,0.8,15,0.4,60],
["Melon (cantaloupe)","Fruit","g",100,0.8,8,0.2,34],
["Orange","Fruit","g",100,0.9,12,0.1,47],
["Papaya","Fruit","g",100,0.5,11,0.3,43],
["Peach","Fruit","g",100,0.9,10,0.3,39],
["Pear","Fruit","g",100,0.4,15,0.1,57],
["Pineapple","Fruit","g",100,0.5,13,0.1,50],
["Pomegranate","Fruit","g",100,1.7,19,1.2,83],
["Strawberries","Fruit","g",100,0.7,7.7,0.3,32],
["Watermelon","Fruit","g",100,0.6,7.6,0.2,30],
["Beetroot","Vegetable","g",100,1.6,10,0.2,43],
["Bitter gourd / Karela","Vegetable","g",100,1,4,0.2,17],
["Bottle gourd / Lauki","Vegetable","g",100,0.6,3.4,0,14],
["Broccoli","Vegetable","g",100,2.8,7,0.4,34],
["Cabbage","Vegetable","g",100,1.3,6,0.1,25],
["Capsicum / Bell pepper","Vegetable","g",100,1,6,0.3,31],
["Carrot","Vegetable","g",100,0.9,10,0.2,41],
["Cauliflower / Gobi","Vegetable","g",100,1.9,5,0.3,25],
["Cucumber","Vegetable","g",100,0.7,3.6,0.1,15],
["Eggplant / Baingan","Vegetable","g",100,1,6,0.2,25],
["Garlic","Vegetable","g",100,6,33,0.5,149],
["Ginger","Vegetable","g",100,1.8,18,0.8,80],
["Green beans","Vegetable","g",100,1.8,7,0.2,31],
["Lettuce","Vegetable","g",100,1.4,2.9,0.2,15],
["Mushroom","Vegetable","g",100,3.1,3.3,0.3,22],
["Okra / Bhindi","Vegetable","g",100,1.9,7,0.2,33],
["Onion","Vegetable","g",100,1.1,9,0.1,40],
["Peas (green) / Matar","Vegetable","g",100,5,14,0.4,81],
["Pumpkin","Vegetable","g",100,1,7,0.1,26],
["Spinach / Palak","Vegetable","g",100,2.9,3.6,0.4,23],
["Tomato","Vegetable","g",100,0.9,3.9,0.2,18],
["Hummus","Extras","tbsp",1,1.2,2,2.6,37],
["Ketchup","Extras","tbsp",1,0.2,4.5,0,17],
["Mayonnaise","Extras","tbsp",1,0.1,0.6,10,94],
["Soy sauce","Extras","tbsp",1,1.3,0.8,0,8],
];
const CAT_ORDER=["Protein","Carb","Fat","Dairy","Fruit","Vegetable","Extras"];
const FOODS = FOODS_RAW.map(f=>({
  name:f[0],cat:f[1],unit:f[2],
  p:f[4]/f[3], c:f[5]/f[3], fat:f[6]/f[3], cal:f[7]/f[3]
})).sort((a,b)=> CAT_ORDER.indexOf(a.cat)-CAT_ORDER.indexOf(b.cat) || a.name.localeCompare(b.name));
const byName = Object.fromEntries(FOODS.map(f=>[f.name,f]));
const MACROS=["Protein","Carbs","Fats","Calories"], MKEY=["p","c","fat","cal"], MUNIT=["g","g","g",""];

/* ====================== FOOD DIETARY FLAGS (computed, for restriction filtering in the auto-generator) ====================== */
const MEAT_FISH_WORDS=["beef","mutton","lamb","goat","chicken","turkey","fish","salmon","tuna","sardine","mackerel","cod","tilapia","rohu","pangasius","sole","prawns","shrimp"];
const GLUTEN_WORDS=["atta","wheat flour","bread","bun","naan","pasta","paratha","roti","chapati","vermicelli","seviyan"];
const NUT_WORDS=["almond","cashew","pistachio","walnut","peanut","pine nut","chilgoza"];
function foodFlags(f){
  const n=f.name.toLowerCase();
  const isMeatFish=MEAT_FISH_WORDS.some(w=>n.includes(w));
  const isEgg=n.includes("egg");
  const isDairy=f.cat==="Dairy";
  const isWheyOrCasein=n.includes("whey")||n.includes("casein");
  return {
    vegetarian: !isMeatFish && !isEgg,
    vegan: !isMeatFish && !isEgg && !isDairy && !isWheyOrCasein,
    gluten: GLUTEN_WORDS.some(w=>n.includes(w)),
    lactose: isDairy || isWheyOrCasein,
    nut: NUT_WORDS.some(w=>n.includes(w))
  };
}
FOODS.forEach(f=>Object.assign(f,foodFlags(f)));
function foodPassesRestrictions(f,restrictions){
  if(!restrictions||!restrictions.length||restrictions.includes("None")) return true;
  if(restrictions.includes("Vegan") && !f.vegan) return false;
  if(restrictions.includes("Vegetarian") && !f.vegetarian) return false;
  if(restrictions.includes("Gluten Free") && f.gluten) return false;
  if(restrictions.includes("Lactose Intolerant") && f.lactose) return false;
  if(restrictions.includes("Nut Allergy") && f.nut) return false;
  return true;
}


/* ====================== EXERCISE DATABASE (~90 exercises, 9 categories) ======================
   [name, category, equipment, injuryTags]
   equipment: one of Dumbbells/Barbell/Full Gym Access/Mat/Cardio Machine/Bodyweight Only — used to filter by client's available equipment
   injuryTags: body areas this exercise stresses — used to filter out exercises for a client's stated injuries */
const EXERCISES_RAW = [
// Chest
["Barbell Bench Press","Chest","Barbell",["shoulder","wrist"]],["Incline Barbell Bench Press","Chest","Barbell",["shoulder","wrist"]],["Decline Bench Press","Chest","Barbell",["shoulder","wrist"]],
["Dumbbell Bench Press","Chest","Dumbbells",["shoulder","wrist"]],["Incline Dumbbell Press","Chest","Dumbbells",["shoulder","wrist"]],["Dumbbell Flyes","Chest","Dumbbells",["shoulder"]],
["Cable Crossover","Chest","Full Gym Access",["shoulder"]],["Pec Deck Machine","Chest","Full Gym Access",["shoulder"]],["Push-Ups","Chest","Bodyweight Only",["wrist","shoulder"]],
["Dips (Chest)","Chest","Bodyweight Only",["shoulder"]],["Landmine Press","Chest","Barbell",["shoulder"]],["Machine Chest Press","Chest","Full Gym Access",["shoulder"]],
// Back
["Deadlift","Back","Barbell",["back","hip"]],["Barbell Row","Back","Barbell",["back"]],["Pendlay Row","Back","Barbell",["back"]],["T-Bar Row","Back","Full Gym Access",["back"]],
["Seated Cable Row","Back","Full Gym Access",["back"]],["Lat Pulldown","Back","Full Gym Access",["shoulder"]],["Pull-Ups","Back","Bodyweight Only",["shoulder"]],["Chin-Ups","Back","Bodyweight Only",["shoulder","elbow"]],
["Single-Arm Dumbbell Row","Back","Dumbbells",["back"]],["Face Pull","Back","Full Gym Access",[]],["Rack Pulls","Back","Barbell",["back"]],["Straight Arm Pulldown","Back","Full Gym Access",["shoulder"]],
// Shoulders
["Overhead Press","Shoulders","Barbell",["shoulder"]],["Seated Dumbbell Press","Shoulders","Dumbbells",["shoulder"]],["Arnold Press","Shoulders","Dumbbells",["shoulder"]],
["Lateral Raise","Shoulders","Dumbbells",["shoulder"]],["Front Raise","Shoulders","Dumbbells",["shoulder"]],["Rear Delt Fly","Shoulders","Dumbbells",["shoulder"]],
["Cable Lateral Raise","Shoulders","Full Gym Access",["shoulder"]],["Upright Row","Shoulders","Barbell",["shoulder"]],["Shrugs","Shoulders","Dumbbells",[]],
["Machine Shoulder Press","Shoulders","Full Gym Access",["shoulder"]],["Reverse Pec Deck","Shoulders","Full Gym Access",["shoulder"]],
// Legs
["Back Squat","Legs","Barbell",["knee","back"]],["Front Squat","Legs","Barbell",["knee","wrist"]],["Leg Press","Legs","Full Gym Access",["knee"]],["Romanian Deadlift","Legs","Barbell",["back","hamstring"]],
["Leg Curl","Legs","Full Gym Access",["knee","hamstring"]],["Leg Extension","Legs","Full Gym Access",["knee"]],["Walking Lunges","Legs","Dumbbells",["knee"]],["Bulgarian Split Squat","Legs","Dumbbells",["knee"]],
["Hack Squat","Legs","Full Gym Access",["knee"]],["Goblet Squat","Legs","Dumbbells",["knee"]],["Calf Raise (Standing)","Legs","Full Gym Access",["ankle"]],["Calf Raise (Seated)","Legs","Full Gym Access",["ankle"]],
// Biceps
["Barbell Curl","Biceps","Barbell",["elbow","wrist"]],["Dumbbell Curl","Biceps","Dumbbells",["elbow"]],["Hammer Curl","Biceps","Dumbbells",["elbow"]],["Preacher Curl","Biceps","Full Gym Access",["elbow"]],
["Cable Curl","Biceps","Full Gym Access",["elbow"]],["Concentration Curl","Biceps","Dumbbells",["elbow"]],["Incline Dumbbell Curl","Biceps","Dumbbells",["elbow"]],
// Triceps
["Triceps Pushdown","Triceps","Full Gym Access",["elbow"]],["Skull Crushers","Triceps","Barbell",["elbow"]],["Overhead Triceps Extension","Triceps","Dumbbells",["elbow","shoulder"]],
["Close-Grip Bench Press","Triceps","Barbell",["elbow","wrist","shoulder"]],["Dips (Triceps)","Triceps","Bodyweight Only",["shoulder","elbow"]],["Cable Kickback","Triceps","Full Gym Access",["elbow"]],["Rope Pushdown","Triceps","Full Gym Access",["elbow"]],
// Core
["Plank","Core","Mat",[]],["Cable Crunch","Core","Full Gym Access",["back"]],["Hanging Leg Raise","Core","Bodyweight Only",["shoulder"]],["Ab Wheel Rollout","Core","Mat",["back","shoulder"]],
["Russian Twist","Core","Mat",["back"]],["Bicycle Crunch","Core","Mat",[]],["Sit-Ups","Core","Mat",["back"]],["Side Plank","Core","Mat",[]],
["Mountain Climbers","Core","Bodyweight Only",["wrist"]],["Decline Sit-Ups","Core","Mat",["back"]],
// Glutes
["Hip Thrust","Glutes","Barbell",["hip"]],["Glute Bridge","Glutes","Bodyweight Only",["hip"]],["Cable Pull-Through","Glutes","Full Gym Access",["back"]],["Glute Kickback","Glutes","Full Gym Access",["hip"]],
["Sumo Deadlift","Glutes","Barbell",["back","hip","knee"]],["Step-Ups","Glutes","Dumbbells",["knee"]],["Curtsy Lunge","Glutes","Dumbbells",["knee"]],["Abduction Machine","Glutes","Full Gym Access",["hip"]],
// Cardio / Full Body
["Treadmill Run","Cardio/Full Body","Cardio Machine",["knee","ankle"]],["Rowing Machine","Cardio/Full Body","Cardio Machine",["back"]],["Stationary Bike","Cardio/Full Body","Cardio Machine",["knee"]],
["Battle Ropes","Cardio/Full Body","Full Gym Access",["shoulder"]],["Burpees","Cardio/Full Body","Bodyweight Only",["knee","wrist","shoulder"]],["Jump Rope","Cardio/Full Body","Bodyweight Only",["knee","ankle"]],
["Kettlebell Swing","Cardio/Full Body","Dumbbells",["back","hip"]],["Box Jump","Cardio/Full Body","Bodyweight Only",["knee","ankle"]],["Sled Push","Cardio/Full Body","Full Gym Access",["back","knee"]],
];
const EX_CAT_ORDER=["Chest","Back","Shoulders","Legs","Biceps","Triceps","Core","Glutes","Cardio/Full Body"];
const EXERCISES = EXERCISES_RAW.map(e=>({name:e[0],cat:e[1],equipment:e[2],injuryTags:e[3]}))
  .sort((a,b)=> EX_CAT_ORDER.indexOf(a.cat)-EX_CAT_ORDER.indexOf(b.cat) || a.name.localeCompare(b.name));

/* ====================== STORAGE (SUPABASE) ====================== */
const PREFIX_TO_KIND = { "plan:":"diet", "rmplan:":"ready_made_workout", "wplan:":"custom_workout" };

const Store = {
  async list(prefix="plan:"){
    const kind=PREFIX_TO_KIND[prefix]||"diet";
    if(!currentUser) return [];
    let q=sb.from("plans").select("data").eq("kind",kind);
    if(currentProfile && currentProfile.role==="client"){
      q=q.eq("client_id",currentUser.id);
    } else {
      q=q.eq("trainer_id",currentUser.id);
    }
    const {data,error}=await q;
    if(error){ console.error(error); return []; }
    const out=(data||[]).map(r=>r.data);
    return out.sort((a,b)=>(b.updated||0)-(a.updated||0));
  },
  async save(obj,prefix="plan:"){
    const kind=PREFIX_TO_KIND[prefix]||"diet";
    if(!currentUser) return false;
    if(currentProfile && currentProfile.role==="client"){
      // client can only update the data on their own existing row, never touch ownership
      const {error}=await sb.from("plans").update({data:obj,updated_at:new Date().toISOString()}).eq("id",obj.id);
      if(error){ console.error(error); return false; }
      return true;
    }
    const row={ id:obj.id, kind, trainer_id:currentUser.id, data:obj, updated_at:new Date().toISOString() };
    if(obj.clientUserId) row.client_id=obj.clientUserId;
    const {error}=await sb.from("plans").upsert(row);
    if(error){ console.error(error); return false; }
    return true;
  },
  async remove(id,prefix="plan:"){
    const {error}=await sb.from("plans").delete().eq("id",id);
    if(error) console.error(error);
  }
};

/* ====================== AUTH ====================== */
let signupRole="trainer";
function setAuthTab(tab){
  document.getElementById("tabLogin").classList.toggle("active",tab==="login");
  document.getElementById("tabSignup").classList.toggle("active",tab==="signup");
  document.getElementById("loginForm").classList.toggle("hidden",tab!=="login");
  document.getElementById("signupForm").classList.toggle("hidden",tab!=="signup");
  hideAuthMsgs();
}
function setSignupRole(role){
  signupRole=role;
  document.getElementById("roleTrainerBtn").classList.toggle("active",role==="trainer");
  document.getElementById("roleClientBtn").classList.toggle("active",role==="client");

}
function hideAuthMsgs(){
  document.getElementById("authError").classList.add("hidden");
  document.getElementById("authMsg").classList.add("hidden");
}
function showAuthError(msg){
  hideAuthMsgs();
  const el=document.getElementById("authError"); el.textContent=msg; el.classList.remove("hidden");
}
function showAuthMsg(msg){
  hideAuthMsgs();
  const el=document.getElementById("authMsg"); el.textContent=msg; el.classList.remove("hidden");
}

async function doSignup(){
  const name=document.getElementById("suName").value.trim();
  const email=document.getElementById("suEmail").value.trim();
  const password=document.getElementById("suPassword").value;


  if(!name||!email||!password){ showAuthError("Fill in all fields"); return; }
  if(password.length<6){ showAuthError("Password must be at least 6 characters"); return; }


  const btn=document.getElementById("signupBtn"); btn.disabled=true; btn.textContent="Creating account...";

  const {data,error}=await sb.auth.signUp({
    email,password,
    options:{ data:{ full_name:name, role:signupRole } }
  });

  if(error){
    console.error("Signup error:",error);
    const detail=error.message||error.error_description||error.msg||(error.status?`HTTP ${error.status}`:"Unknown error — check browser console");
    showAuthError(detail);
    btn.disabled=false; btn.textContent="Create Account"; return;
  }


  btn.disabled=false; btn.textContent="Create Account";

  if(data.session){
    showAuthMsg("Account created! Logging you in...");
    setTimeout(()=>checkSession(),600);
  } else {
    showAuthMsg("Account created. Check your email to confirm, then log in.");
    setTimeout(()=>setAuthTab("login"),1800);
  }
}

async function doLogin(){
  const email=document.getElementById("loginEmail").value.trim();
  const password=document.getElementById("loginPassword").value;
  if(!email||!password){ showAuthError("Enter email and password"); return; }
  const btn=document.getElementById("loginBtn"); btn.disabled=true; btn.textContent="Logging in...";
  const {data,error}=await sb.auth.signInWithPassword({email,password});
  btn.disabled=false; btn.textContent="Log In";
  if(error){
    console.error("Login error:",error);
    const detail=error.message||error.error_description||error.msg||(error.status?`HTTP ${error.status}`:"Unknown error — check browser console");
    showAuthError(detail);
    return;
  }
  checkSession();
}

async function doSignOut(){
  await sb.auth.signOut();
}

async function resetAuthUI(){
  currentUser=null; currentProfile=null;
  rmSlots=[null,null]; rmActiveSlot=0;
  document.getElementById("appWrap").classList.add("hidden");
  document.getElementById("onboardingView").classList.add("hidden");
  document.getElementById("chooseTrainerView").classList.add("hidden");
  document.getElementById("authView").classList.remove("hidden");
  document.getElementById("loginEmail").value="";
  document.getElementById("loginPassword").value="";
  hideAuthMsgs();
}

async function checkSession(){
  const {data:{session}}=await sb.auth.getSession();
  if(!session){
    document.getElementById("authView").classList.remove("hidden");
    document.getElementById("chooseTrainerView").classList.add("hidden");
    document.getElementById("onboardingView").classList.add("hidden");
    document.getElementById("appWrap").classList.add("hidden");
    return;
  }
  currentUser=session.user;
  const {data:profile,error}=await sb.from("profiles").select("*").eq("id",currentUser.id).single();
  if(error||!profile){ showAuthError("Couldn't load your profile. Try logging in again."); return; }
  currentProfile=profile;

  document.getElementById("authView").classList.add("hidden");

  if(profile.role==="client" && !profile.onboarding_completed){
    document.getElementById("appWrap").classList.add("hidden");
    if(!profile.trainer_id){
      trainerChoiceMode="onboarding";
      document.getElementById("chooseTrainerPrompt").textContent="Are you training with a coach, or using the app on your own?";
      document.getElementById("cancelChangeTrainerBtn").classList.add("hidden");
      document.getElementById("onboardingView").classList.add("hidden");
      document.getElementById("chooseTrainerView").classList.remove("hidden");
      renderTrainerPickList();
    } else {
      document.getElementById("chooseTrainerView").classList.add("hidden");
      document.getElementById("onboardingView").classList.remove("hidden");
      await startOnboardingForm();
    }
    return;
  }
  document.getElementById("chooseTrainerView").classList.add("hidden");
  document.getElementById("onboardingView").classList.add("hidden");
  document.getElementById("appWrap").classList.remove("hidden");

  if(profile.role==="client"){
    document.getElementById("homeView").classList.add("hidden");
    document.getElementById("dietApp").classList.add("hidden");
    document.getElementById("workoutApp").classList.add("hidden");
    document.getElementById("clientHomeView").classList.remove("hidden");
    document.getElementById("clientGreeting").textContent=profile.full_name?`Hi, ${profile.full_name}`:"My Plans";
    renderClientTrainerLine();
    renderClientPlans();
  } else {
    document.getElementById("clientHomeView").classList.add("hidden");
    gotoHome();
  }
}

async function renderClientTrainerLine(){
  const el=document.getElementById("clientTrainerLine");
  if(!el) return;
  if(!currentProfile.trainer_id){
    el.innerHTML=`Training on your own · <a href="#" onclick="event.preventDefault();openChangeTrainer()" style="color:var(--teal-2);font-weight:700;text-decoration:none">Pick a trainer</a>`;
    return;
  }
  try{
    const {data:t}=await sb.from("profiles").select("full_name").eq("id",currentProfile.trainer_id).single();
    el.innerHTML=`Training with <b>${esc(t?.full_name)||"your trainer"}</b> · <a href="#" onclick="event.preventDefault();openChangeTrainer()" style="color:var(--teal-2);font-weight:700;text-decoration:none">Change</a>`;
  }catch(e){
    el.innerHTML="";
  }
}

/* ====================== CHOOSE TRAINER (client, right after signup — or later via "Change Trainer") ====================== */
let trainerChoiceMode="onboarding"; // "onboarding" | "change"

async function renderTrainerPickList(){
  const el=document.getElementById("trainerPickList");
  el.innerHTML='<div class="empty">Loading trainers...</div>';
  try{
    const {data:trainers,error}=await sb.from("profiles").select("id,full_name").eq("role","trainer");
    if(error) throw error;
    const others=(trainers||[]).filter(t=>t.id!==currentProfile.trainer_id);
    if(!others.length){ el.innerHTML='<div class="empty">No trainers available yet.</div>'; return; }
    el.innerHTML=others.map(t=>`
      <div class="trainer-pick-card" onclick="pickTrainer('${t.id}')">
        <div class="who">${esc(t.full_name)||"Trainer"}</div>
        <span style="font-size:20px;color:#7e9197">›</span>
      </div>`).join("");
  }catch(e){
    console.error("renderTrainerPickList failed:",e);
    el.innerHTML='<div class="empty">Couldn\'t load trainers. Try again.</div>';
  }
}
async function pickTrainer(trainerId){
  const {error}=await sb.from("profiles").update({trainer_id:trainerId}).eq("id",currentUser.id);
  if(error){ console.error(error); toast("Couldn't switch trainer — try again"); return; }
  currentProfile.trainer_id=trainerId;
  if(trainerChoiceMode==="change"){
    document.getElementById("chooseTrainerView").classList.add("hidden");
    document.getElementById("appWrap").classList.remove("hidden");
    gotoClientHome();
    toast("Trainer updated");
    return;
  }
  checkSession();
}
async function skipTrainerChoice(){
  if(trainerChoiceMode==="change"){
    const {error}=await sb.from("profiles").update({trainer_id:null}).eq("id",currentUser.id);
    if(error){ console.error(error); toast("Couldn't update — try again"); return; }
    currentProfile.trainer_id=null;
    document.getElementById("chooseTrainerView").classList.add("hidden");
    document.getElementById("appWrap").classList.remove("hidden");
    gotoClientHome();
    toast("Now training on your own");
    return;
  }
  // no trainer chosen — go straight to the full default questionnaire
  document.getElementById("chooseTrainerView").classList.add("hidden");
  document.getElementById("onboardingView").classList.remove("hidden");
  await startOnboardingForm();
}
function openChangeTrainer(){
  trainerChoiceMode="change";
  document.getElementById("chooseTrainerPrompt").textContent="Pick a different trainer, or train on your own.";
  document.getElementById("cancelChangeTrainerBtn").classList.remove("hidden");
  document.getElementById("appWrap").classList.add("hidden");
  document.getElementById("chooseTrainerView").classList.remove("hidden");
  renderTrainerPickList();
}
function cancelChangeTrainer(){
  trainerChoiceMode="onboarding";
  document.getElementById("chooseTrainerView").classList.add("hidden");
  document.getElementById("appWrap").classList.remove("hidden");
  gotoClientHome();
}


/* ====================== CLIENT ONBOARDING QUESTIONNAIRE (trainer-configurable, forced after signup) ====================== */
const OB_EQUIPMENT=["Dumbbells","Barbell","Resistance Bands","Mat","Swiss Ball","Cardio Machine","Full Gym Access","Bodyweight Only"];
const OB_DIET=["Vegetarian","Vegan","Halal","Lactose Intolerant","Gluten Free","Nut Allergy","None"];
const QUESTION_DEFS=[
  {key:"age",label:"Age",type:"number",locked:true,min:10,max:100,placeholder:"e.g. 28"},
  {key:"goal",label:"Goal",type:"select",locked:true,options:["Fat Loss","Muscle Gain","General Fitness","Strength","Endurance","Other"]},
  {key:"height",label:"Height (cm)",type:"number",min:100,max:230,placeholder:"e.g. 172"},
  {key:"weight",label:"Weight (kg)",type:"number",min:30,max:250,placeholder:"e.g. 70"},
  {key:"experience",label:"Experience Level",type:"select",options:["Beginner","Intermediate","Advanced"]},
  {key:"activity",label:"Activity Level",type:"select",options:["Sedentary (little/no exercise)","Lightly Active (1–3 days/week)","Moderately Active (3–5 days/week)","Very Active (6–7 days/week)"]},
  {key:"timeAvailable",label:"Time Available Per Session",type:"select",options:["Under 30 min","30–45 min","45–60 min","60+ min"]},
  {key:"equipment",label:"Equipment Available",type:"chips",options:OB_EQUIPMENT},
  {key:"dietaryRestrictions",label:"Dietary Restrictions",type:"chips",options:OB_DIET},
  {key:"injury",label:"Injuries / Limitations",type:"textarea",placeholder:"Note any injuries, pain, or movements to avoid..."},
  {key:"extra",label:"Anything Else Your Coach Should Know",type:"textarea",placeholder:"Anything we didn't ask that you think matters — schedule, past experience, preferences, concerns..."}
];
const LOCKED_KEYS=QUESTION_DEFS.filter(q=>q.locked).map(q=>q.key);
let obChipState={};
let obEnabledKeys=QUESTION_DEFS.map(q=>q.key);
let onboardingContext="self"; // "self" | "gymAdd" | "gymEdit"
let gymEditId=null;

async function startOnboardingForm(){
  onboardingContext="self"; gymEditId=null;
  document.getElementById("obGymNameSection").classList.add("hidden");
  document.getElementById("obCancelBtn").classList.add("hidden");
  document.getElementById("obSubmitBtn").textContent="Finish Setup";
  // pull the client's trainer's custom question set, fall back to everything
  obEnabledKeys=QUESTION_DEFS.map(q=>q.key);
  if(currentProfile.trainer_id){
    try{
      const {data:t,error}=await sb.from("profiles").select("trainer_form").eq("id",currentProfile.trainer_id).single();
      if(!error && t && Array.isArray(t.trainer_form) && t.trainer_form.length){
        obEnabledKeys=Array.from(new Set([...t.trainer_form,...LOCKED_KEYS]));
      }
    }catch(e){ console.error("Couldn't load trainer's form, using default:",e); }
  }
  renderOnboardingForm();
}

function renderOnboardingForm(){
  obChipState={};
  document.getElementById("obError").classList.add("hidden");
  const fields=QUESTION_DEFS.filter(q=>obEnabledKeys.includes(q.key));
  document.getElementById("obFields").innerHTML=fields.map(q=>{
    const req=q.locked?'<span class="ob-req">*</span>':"";
    if(q.type==="number") return `<div class="ob-section"><label>${q.label}${req}</label>
      <input type="number" id="ob_${q.key}" min="${q.min}" max="${q.max}" placeholder="${q.placeholder||""}"></div>`;
    if(q.type==="select") return `<div class="ob-section"><label>${q.label}${req}</label>
      <select id="ob_${q.key}"><option value="">Select…</option>${q.options.map(o=>`<option>${o}</option>`).join("")}</select></div>`;
    if(q.type==="textarea") return `<div class="ob-section"><label>${q.label}${req}</label>
      <textarea id="ob_${q.key}" placeholder="${q.placeholder||""}"></textarea></div>`;
    if(q.type==="chips"){
      obChipState[q.key]=new Set();
      return `<div class="ob-section"><label>${q.label}${req}</label>
        <div class="ob-chips" id="ob_${q.key}">${q.options.map(o=>
          `<button type="button" class="ob-chip" onclick="obToggleChip('${q.key}','${o}',this)">${o}</button>`).join("")}</div></div>`;
    }
    return "";
  }).join("");
}
function obToggleChip(key,val,btn){
  const set=obChipState[key];
  if(set.has(val)){ set.delete(val); btn.classList.remove("active"); }
  else { set.add(val); btn.classList.add("active"); }
}
async function submitOnboarding(){
  const errEl=document.getElementById("obError");
  const isGym=onboardingContext==="gymAdd"||onboardingContext==="gymEdit";
  let gymName="";
  if(isGym){
    gymName=document.getElementById("obGymName").value.trim();
    if(!gymName){ errEl.textContent="Enter the client's name"; errEl.classList.remove("hidden"); return; }
  }
  const ageEl=document.getElementById("ob_age"), goalEl=document.getElementById("ob_goal");
  const age=ageEl?(parseInt(ageEl.value)||0):0;
  const goal=goalEl?goalEl.value:"";
  if(!age||age<10||age>100){ errEl.textContent="Enter a valid age"; errEl.classList.remove("hidden"); return; }
  if(!goal){ errEl.textContent="Select a goal"; errEl.classList.remove("hidden"); return; }
  errEl.classList.add("hidden");

  const data={submittedAt:Date.now()};
  QUESTION_DEFS.filter(q=>obEnabledKeys.includes(q.key)).forEach(q=>{
    if(q.type==="chips"){ data[q.key]=Array.from(obChipState[q.key]||[]); return; }
    const el=document.getElementById(`ob_${q.key}`);
    if(!el) return;
    if(q.type==="number") data[q.key]=el.value?parseInt(el.value):null;
    else data[q.key]=el.value.trim?el.value.trim()||null:el.value||null;
  });

  const btn=document.getElementById("obSubmitBtn"); btn.disabled=true; btn.textContent="Saving...";

  if(onboardingContext==="gymAdd"){
    const {error}=await sb.from("gym_clients").insert({trainer_id:currentUser.id, full_name:gymName, onboarding:data, onboarding_completed:true});
    btn.disabled=false; btn.textContent="Add Client";
    if(error){ console.error(error); errEl.textContent="Couldn't save — try again."; errEl.classList.remove("hidden"); return; }
    document.getElementById("onboardingView").classList.add("hidden");
    document.getElementById("appWrap").classList.remove("hidden");
    toast("Client added");
    openClients();
    return;
  }
  if(onboardingContext==="gymEdit"){
    const {error}=await sb.from("gym_clients").update({full_name:gymName, onboarding:data, updated_at:new Date().toISOString()}).eq("id",gymEditId);
    btn.disabled=false; btn.textContent="Save Changes";
    if(error){ console.error(error); errEl.textContent="Couldn't save — try again."; errEl.classList.remove("hidden"); return; }
    document.getElementById("onboardingView").classList.add("hidden");
    document.getElementById("appWrap").classList.remove("hidden");
    toast("Client updated");
    openClientProfile(gymEditId,"gym");
    return;
  }

  const {error}=await sb.from("profiles").update({onboarding:data,onboarding_completed:true}).eq("id",currentUser.id);
  btn.disabled=false; btn.textContent="Finish Setup";
  if(error){ console.error(error); errEl.textContent="Couldn't save — try again."; errEl.classList.remove("hidden"); return; }

  currentProfile.onboarding=data; currentProfile.onboarding_completed=true;
  checkSession();
}

/* ====================== ONBOARDING FORM BUILDER (trainer customizes their own question set) ====================== */
let fbEnabled=new Set();
function openFormBuilder(){
  document.getElementById("homeView").classList.add("hidden");
  document.getElementById("dietApp").classList.add("hidden");
  document.getElementById("workoutApp").classList.add("hidden");
  document.getElementById("clientsListView").classList.add("hidden");
  document.getElementById("clientProfileView").classList.add("hidden");
  document.getElementById("formBuilderView").classList.remove("hidden");
  renderFormBuilder();
  window.scrollTo(0,0);
}
function renderFormBuilder(){
  const saved=Array.isArray(currentProfile.trainer_form)&&currentProfile.trainer_form.length
    ? currentProfile.trainer_form : QUESTION_DEFS.map(q=>q.key);
  fbEnabled=new Set([...saved,...LOCKED_KEYS]);
  document.getElementById("fbList").innerHTML=QUESTION_DEFS.map(q=>{
    const on=fbEnabled.has(q.key);
    return `<div class="fb-row">
      <div class="lbl">${q.label}${q.locked?'<span class="locked">Always on</span>':""}</div>
      <button class="fb-toggle${on?" on":""}" ${q.locked?"disabled":""} onclick="toggleFbKey('${q.key}',this)"></button>
    </div>`;
  }).join("");
}
function toggleFbKey(key,btn){
  if(fbEnabled.has(key)){ fbEnabled.delete(key); btn.classList.remove("on"); }
  else { fbEnabled.add(key); btn.classList.add("on"); }
}
async function saveFormBuilder(){
  const keys=Array.from(new Set([...fbEnabled,...LOCKED_KEYS]));
  const {error}=await sb.from("profiles").update({trainer_form:keys}).eq("id",currentUser.id);
  if(error){ console.error(error); toast("Couldn't save — try again"); return; }
  currentProfile.trainer_form=keys;
  toast("Form updated");
}

/* ====================== AUTO-ADJUSTED PLAN ENGINE (rules-based, from onboarding data) ======================
   Turns onboarding answers into a starter Workout plan + Diet plan. Always meant to be reviewed/edited
   before being treated as final — nothing here is medical advice, just a sensible starting point. */

const GOAL_SCHEME={
  "Fat Loss":       {sets:3, reps:"12-15", rest:"45-60 sec", kcalPerKg:22, proteinPerKg:2.0},
  "Muscle Gain":    {sets:4, reps:"8-12",  rest:"60-90 sec", kcalPerKg:34, proteinPerKg:2.0},
  "General Fitness":{sets:3, reps:"10-12", rest:"60 sec",    kcalPerKg:28, proteinPerKg:1.6},
  "Strength":       {sets:4, reps:"4-6",   rest:"2-3 min",   kcalPerKg:30, proteinPerKg:1.8},
  "Endurance":      {sets:3, reps:"15-20", rest:"30-45 sec", kcalPerKg:30, proteinPerKg:1.6},
  "Other":          {sets:3, reps:"10-12", rest:"60 sec",    kcalPerKg:28, proteinPerKg:1.6}
};
const EXS_PER_TIME={"Under 30 min":4,"30–45 min":5,"45–60 min":6,"60+ min":7};

function exercisePassesEquipment(ex,equipList){
  if(!equipList||!equipList.length) return ex.equipment==="Bodyweight Only"||ex.equipment==="Mat";
  if(equipList.includes("Full Gym Access")) return true;
  if(ex.equipment==="Bodyweight Only") return true;
  if(ex.equipment==="Mat") return equipList.includes("Mat")||equipList.includes("Bodyweight Only");
  return equipList.includes(ex.equipment);
}
function exercisePassesInjury(ex,injuryText){
  if(!injuryText) return true;
  const t=injuryText.toLowerCase();
  const AREA_WORDS={knee:["knee"],back:["back","spine","disc"],shoulder:["shoulder"],wrist:["wrist"],
    ankle:["ankle"],hip:["hip"],elbow:["elbow"],hamstring:["hamstring"]};
  return !ex.injuryTags.some(area=>(AREA_WORDS[area]||[area]).some(w=>t.includes(w)));
}
function pickExercises(pool,cat,count,equipList,injuryText,usedNames){
  return pool.filter(e=>e.cat===cat && exercisePassesEquipment(e,equipList) && exercisePassesInjury(e,injuryText) && !usedNames.has(e.name))
    .slice(0,count);
}

// day templates by experience level: which body-part categories each day should pull from
const SPLIT_BY_EXPERIENCE={
  "Beginner":[["Legs","Chest","Back","Shoulders","Core"],["Legs","Back","Chest","Biceps","Core"],["Legs","Shoulders","Back","Triceps","Core"]],
  "Intermediate":[["Chest","Shoulders","Triceps"],["Back","Biceps","Core"],["Legs","Glutes"],["Chest","Back","Shoulders","Core"]],
  "Advanced":[["Chest","Triceps"],["Back","Biceps"],["Legs","Glutes"],["Shoulders","Core"],["Chest","Back","Legs"]]
};

function generateWorkoutPlan(ob,clientName){
  const goal=ob.goal||"General Fitness";
  const scheme=GOAL_SCHEME[goal]||GOAL_SCHEME["General Fitness"];
  const experience=ob.experience||"Beginner";
  const exCount=EXS_PER_TIME[ob.timeAvailable]||5;
  const equipList=ob.equipment||[];
  const injuryText=ob.injury||"";
  const dayCats=SPLIT_BY_EXPERIENCE[experience]||SPLIT_BY_EXPERIENCE["Beginner"];

  const exercises=[];
  dayCats.forEach((cats,di)=>{
    const dayName="Day "+(di+1)+" – "+cats.join(" / ");
    const usedNames=new Set();
    let dayExCount=0, perCat=Math.ceil(exCount/cats.length);
    cats.forEach(cat=>{
      if(dayExCount>=exCount) return;
      const picks=pickExercises(EXERCISES,cat,Math.min(perCat,exCount-dayExCount),equipList,injuryText,usedNames);
      picks.forEach(ex=>{
        usedNames.add(ex.name);
        exercises.push({name:ex.name,sets:String(scheme.sets),reps:scheme.reps,rest:scheme.rest,weight:"",
          notes:dayExCount===0?"— "+dayName+" —":"",ssGroup:null,ssType:null});
        dayExCount++;
      });
    });
    if(dayExCount===0){
      // equipment/injury filters wiped out this day entirely — fall back to bodyweight core work so the plan never comes back empty
      const fallback=pickExercises(EXERCISES,"Core",2,[],injuryText,new Set());
      fallback.forEach(ex=>exercises.push({name:ex.name,sets:String(scheme.sets),reps:scheme.reps,rest:scheme.rest,weight:"",
        notes:dayExCount===0?"— "+dayName+" (equipment-limited) —":"",ssGroup:null,ssType:null}));
    }
  });

  return { id:"w"+Date.now()+Math.floor(Math.random()*999),
    client:clientName||"", goal:goal, injury:injuryText,
    autoGenerated:true,
    exercises: exercises.length?exercises:[{name:"",sets:"",reps:"",rest:"",notes:"",ssGroup:null,ssType:null}],
    updated:Date.now() };
}

function generateDietPlan(ob,clientName){
  const goal=ob.goal||"General Fitness";
  const scheme=GOAL_SCHEME[goal]||GOAL_SCHEME["General Fitness"];
  const weight=parseFloat(ob.weight)||70;
  const restrictions=ob.dietaryRestrictions||[];

  const kcal=Math.round(weight*scheme.kcalPerKg);
  const proteinG=Math.round(weight*scheme.proteinPerKg);
  const fatG=Math.round((kcal*0.25)/9);
  const carbG=Math.max(0,Math.round((kcal-(proteinG*4)-(fatG*9))/4));

  const pool=cat=>FOODS.filter(f=>f.cat===cat && foodPassesRestrictions(f,restrictions));
  const proteinPool=pool("Protein"),
        carbPool=pool("Carb"),
        // exclude near-zero-fat dairy (skim milk, nonfat yogurt etc) so it never gets picked as a "fat source"
        fatPool=pool("Fat").concat(pool("Dairy").filter(f=>f.fat>=3)),
        vegPool=pool("Vegetable"), fruitPool=pool("Fruit");

  // sensible per-unit ceilings so a low-macro food can never produce an absurd quantity
  const UNIT_CAP={g:400,ml:400,pc:6,slice:6,tbsp:6,tsp:8,scoop:3,portion:4,cup:3,fl_oz:6,oz:12,lb:2,l:2,kg:1,none:6};
  const capQty=(f,qty)=>Math.min(qty, UNIT_CAP[f.unit]!==undefined?UNIT_CAP[f.unit]:400);

  const MEAL_SPLIT=[["Breakfast",.25],["Lunch",.35],["Dinner",.30],["Snack",.10]];
  const meals=MEAL_SPLIT.map(([name,share])=>{
    const items=[];
    const mP=proteinG*share, mC=carbG*share, mF=fatG*share;
    const p=proteinPool[Math.floor(Math.random()*proteinPool.length)];
    if(p) items.push({food:p.name, qty:String(capQty(p,Math.max(1,Math.round(mP/(p.p||1)))))});
    const c=carbPool[Math.floor(Math.random()*carbPool.length)];
    if(c) items.push({food:c.name, qty:String(capQty(c,Math.max(1,Math.round(mC/(c.c||1)))))});
    const f=fatPool[Math.floor(Math.random()*fatPool.length)];
    if(f) items.push({food:f.name, qty:String(capQty(f,Math.max(1,Math.round(mF/(f.fat||1)))))});
    const v=(vegPool.length?vegPool:fruitPool)[Math.floor(Math.random()*(vegPool.length?vegPool.length:fruitPool.length||1))];
    if(v) items.push({food:v.name, qty:"100"});
    if(!items.length) items.push({food:"",qty:""});
    return {name, items};
  });

  return { id:"p"+Date.now()+Math.floor(Math.random()*999),
    client:clientName||"", goal:goal,
    autoGenerated:true,
    targets:[proteinG,carbG,fatG,kcal],
    meals, updated:Date.now() };
}

/* Entry points: build both plans, save them as starting drafts, then open the workout editor for review.
   Works for a client generating their own plan, or a trainer generating one for a linked client. */
async function runAutoGenerate(ob,clientName,clientUserId){
  if(!ob || !ob.goal){ toast("This client hasn't completed onboarding yet"); return; }
  const genWorkout=generateWorkoutPlan(ob,clientName);
  const genDiet=generateDietPlan(ob,clientName);
  if(clientUserId){ genWorkout.clientUserId=clientUserId; genDiet.clientUserId=clientUserId; }

  await Store.save(genWorkout,W_PREFIX);
  await Store.save(genDiet,"plan:");

  toast("Workout + diet plan generated — review below");
  // land in the workout editor (custom plan tool) for immediate review/edit
  document.getElementById("homeView").classList.add("hidden");
  document.getElementById("clientsListView").classList.add("hidden");
  document.getElementById("clientProfileView").classList.add("hidden");
  document.getElementById("clientHomeView").classList.add("hidden");
  document.getElementById("dietApp").classList.add("hidden");
  document.getElementById("workoutApp").classList.remove("hidden");
  document.getElementById("woHome").classList.add("hidden");
  document.getElementById("rmSection").classList.add("hidden");
  document.getElementById("customSection").classList.remove("hidden");
  wPlan=genWorkout; wDirty=false;
  wRenderEditor();
  wShow("edit");
}
async function clientGenerateMyPlan(){
  if(!currentProfile.onboarding_completed || !currentProfile.onboarding){ toast("Complete your onboarding questionnaire first"); return; }
  await runAutoGenerate(currentProfile.onboarding, currentProfile.full_name||"", currentUser.id);
}
async function trainerGeneratePlanFor(clientId,kind){
  try{
    const table=kind==="gym"?"gym_clients":"profiles";
    const {data:c,error}=await sb.from(table).select("full_name,onboarding,onboarding_completed").eq("id",clientId).single();
    if(error) throw error;
    if(!c.onboarding_completed||!c.onboarding){ toast("This client hasn't completed onboarding yet"); return; }
    // gym clients have no login, so there's no clientUserId to link the generated plan to
    await runAutoGenerate(c.onboarding, c.full_name||"", kind==="gym"?null:clientId);
  }catch(e){ console.error("trainerGeneratePlanFor failed:",e); toast("Couldn't generate — try again"); }
}

/* ====================== CLIENT VIEW ====================== */
function lockContainerInputs(containerId){
  const c=document.getElementById(containerId);
  if(!c) return;
  c.querySelectorAll("input,select,textarea").forEach(el=>el.disabled=true);
  c.querySelectorAll(".add-food,.add-meal,.rmrow,.iconbtn").forEach(el=>el.style.display="none");
}

async function renderClientPlans(){
  const list=document.getElementById("clientPlanList");
  list.innerHTML='<div class="empty">Loading your plans...</div>';
  const [diets,readyMades,customs]=await Promise.all([
    Store.list("plan:"), Store.list("rmplan:"), Store.list("wplan:")
  ]);
  const items=[
    ...diets.map(p=>({...p,_kind:"diet"})),
    ...readyMades.map(p=>({...p,_kind:"rm"})),
    ...customs.map(p=>({...p,_kind:"custom"}))
  ].sort((a,b)=>(b.updated||0)-(a.updated||0));

  if(!items.length){ list.innerHTML='<div class="empty">No plans assigned yet.<br>Your trainer will assign one soon.</div>'; return; }

  list.innerHTML=items.map(p=>{
    if(p._kind==="diet") return `
      <div class="client-plan-card" onclick="clientOpenDiet('${p.id}')">
        <span class="kind-tag kind-diet">Diet Plan</span>
        <div class="who">${esc(p.goal)||"Nutrition Plan"}</div>
      </div>`;
    if(p._kind==="rm") return `
      <div class="client-plan-card" onclick="clientOpenReadyMade('${p.id}')">
        <span class="kind-tag kind-workout">${esc(p.templateTag)||"Workout"}</span>
        <div class="who">${esc(p.templateName)||"Strength Program"}</div>
        <div class="meta">Week ${(p.currentWeek||0)+1}</div>
      </div>`;
    return `
      <div class="client-plan-card" onclick="clientOpenCustomWorkout('${p.id}')">
        <span class="kind-tag kind-workout">Custom Workout</span>
        <div class="who">${esc(p.goal)||"Workout Plan"}</div>
      </div>`;
  }).join("");
}

async function clientOpenDiet(id){
  const all=await Store.list("plan:");
  plan=all.find(p=>p.id===id); if(!plan) return;
  document.getElementById("clientHomeView").classList.add("hidden");
  document.getElementById("dietApp").classList.remove("hidden");
  document.getElementById("libView").classList.add("hidden");
  document.getElementById("editView").classList.remove("hidden");
  document.getElementById("actionbar").classList.remove("hidden");
  renderEditor();
  lockContainerInputs("editView");
  document.querySelector("#actionbar .btn-save").style.display="none";
  window.scrollTo(0,0);
}

async function clientOpenCustomWorkout(id){
  const all=await Store.list("wplan:");
  wPlan=all.find(p=>p.id===id); if(!wPlan) return;
  document.getElementById("clientHomeView").classList.add("hidden");
  document.getElementById("workoutApp").classList.remove("hidden");
  document.getElementById("woHome").classList.add("hidden");
  document.getElementById("rmSection").classList.add("hidden");
  document.getElementById("customSection").classList.remove("hidden");
  document.getElementById("wLibView").classList.add("hidden");
  document.getElementById("wEditView").classList.remove("hidden");
  document.getElementById("wActionbar").classList.remove("hidden");
  wRenderEditor();
  lockContainerInputs("wEditView");
  document.querySelector("#wActionbar .w-btn-save").style.display="none";
  window.scrollTo(0,0);
}

async function clientOpenReadyMade(id){
  const all=await Store.list(RM_PREFIX);
  rmPlan=all.find(p=>p.id===id); if(!rmPlan) return;
  rmActiveTemplate=RM_TEMPLATES.find(t=>t.id===rmPlan.templateId)||RM_TEMPLATES[0];
  rmActiveWeek=rmPlan.currentWeek||0;
  document.getElementById("clientHomeView").classList.add("hidden");
  document.getElementById("workoutApp").classList.remove("hidden");
  document.getElementById("woHome").classList.add("hidden");
  document.getElementById("customSection").classList.add("hidden");
  document.getElementById("rmSection").classList.remove("hidden");
  rmRenderPlan();
  rmShow("plan");
}

/* ====================== STATE ====================== */
let plan = null;
let dirty = false;
function blankPlan(){ return { id:"p"+Date.now()+Math.floor(Math.random()*999),
  client:"", goal:"", targets:[0,0,0,0],
  meals:[{name:"Meal 1",items:[{food:"",qty:""}]}], updated:Date.now() }; }

const r1=n=>Math.round(n*10)/10, r0=n=>Math.round(n);
function rowMacros(it){ const f=byName[it.food], q=parseFloat(it.qty)||0; if(!f) return [0,0,0,0];
  return [f.p*q,f.c*q,f.fat*q,f.cal*q]; }
function mealTotals(m){ return m.items.reduce((a,it)=>{const r=rowMacros(it);return a.map((v,i)=>v+r[i])},[0,0,0,0]); }
function dayTotals(){ return plan.meals.reduce((a,m)=>{const t=mealTotals(m);return a.map((v,i)=>v+t[i])},[0,0,0,0]); }

/* ====================== FOOD OPTIONS ====================== */
function foodOptions(sel){
  let html='<option value="">— pick food —</option>', cur="";
  FOODS.forEach(f=>{ if(f.cat!==cur){ if(cur)html+="</optgroup>"; html+=`<optgroup label="${f.cat}">`; cur=f.cat; }
    html+=`<option ${f.name===sel?"selected":""}>${f.name}</option>`; });
  return html+"</optgroup>";
}
function fillFoodDatalist(){
  const dl=document.getElementById("foodDatalist");
  if(dl && !dl.dataset.filled){
    dl.innerHTML=FOODS.map(f=>`<option value="${esc(f.name)}">`).join("");
    dl.dataset.filled="1";
  }
}
function fillExerciseDatalist(){
  const dl=document.getElementById("exerciseDatalist");
  if(dl && !dl.dataset.filled){
    dl.innerHTML=EXERCISES.map(e=>`<option value="${esc(e.name)}">`).join("");
    dl.dataset.filled="1";
  }
}

/* ====================== LIBRARY ====================== */
async function renderLibrary(){
  const plans = await Store.list("plan:");
  const list = document.getElementById("planList");
  if(!plans.length){ list.innerHTML='<div class="empty">No saved plans yet.<br>Tap “New plan” to make your first one.</div>'; return; }
  list.innerHTML = plans.map(p=>{
    const cal = p.meals.reduce((a,m)=>a+mealTotalsOf(m)[3],0);
    const d = new Date(p.updated||Date.now());
    const date = d.toLocaleDateString(undefined,{day:"numeric",month:"short"});
    return `<div class="plan-card" onclick="openPlan('${p.id}')">
      <div>
        <div class="who">${esc(p.client)||"Untitled"}</div>
        <div class="meta">${esc(p.goal)||"—"} · ${date}</div>
      </div>
      <div style="display:flex;align-items:center;">
        <div class="kcal">${r0(cal)}<br><span style="font-size:10px;font-weight:600;color:#90a3a8">kcal</span></div>
        <button class="del" onclick="event.stopPropagation();deletePlan('${p.id}')">🗑</button>
      </div></div>`;
  }).join("");
}
function mealTotalsOf(m){ return m.items.reduce((a,it)=>{const f=byName[it.food],q=parseFloat(it.qty)||0;
  return f?[a[0]+f.p*q,a[1]+f.c*q,a[2]+f.fat*q,a[3]+f.cal*q]:a},[0,0,0,0]); }
function esc(s){ return (s||"").replace(/[<>&"']/g,c=>({"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;","'":"&#39;"}[c])); }

/* ====================== NAVIGATION ====================== */
function isClientMode(){ return currentProfile && currentProfile.role==="client"; }
function gotoClientHome(){
  document.getElementById("homeView").classList.add("hidden");
  document.getElementById("dietApp").classList.add("hidden");
  document.getElementById("workoutApp").classList.add("hidden");
  document.getElementById("progressView").classList.add("hidden");
  document.getElementById("progressLogView").classList.add("hidden");
  document.getElementById("foodLogView").classList.add("hidden");
  document.getElementById("actionbar").classList.add("hidden");
  document.getElementById("wActionbar").classList.add("hidden");
  document.getElementById("rmAssignBar").classList.add("hidden");
  document.getElementById("rmPlanBar").classList.add("hidden");
  document.getElementById("clientHomeView").classList.remove("hidden");
  renderClientTrainerLine();
  renderClientPlans();
  window.scrollTo(0,0);
}
function gotoHome(){
  if(isClientMode()){ gotoClientHome(); return; }
  plan=null; dirty=false;
  document.getElementById("clientHomeView").classList.add("hidden");
  document.getElementById("clientsListView").classList.add("hidden");
  document.getElementById("clientProfileView").classList.add("hidden");
  document.getElementById("formBuilderView").classList.add("hidden");
  document.getElementById("progressView").classList.add("hidden");
  document.getElementById("progressLogView").classList.add("hidden");
  document.getElementById("foodLogView").classList.add("hidden");
  document.getElementById("homeView").classList.remove("hidden");
  document.getElementById("dietApp").classList.add("hidden");
  document.getElementById("workoutApp").classList.add("hidden");
  document.getElementById("actionbar").classList.add("hidden");
  document.getElementById("wActionbar").classList.add("hidden");
  window.scrollTo(0,0);
}

/* ====================== CLIENTS ROSTER (trainer-only, read-only onboarding view) ====================== */
function openClients(){
  document.getElementById("homeView").classList.add("hidden");
  document.getElementById("dietApp").classList.add("hidden");
  document.getElementById("workoutApp").classList.add("hidden");
  document.getElementById("clientProfileView").classList.add("hidden");
  document.getElementById("clientsListView").classList.remove("hidden");
  renderClientsList();
  window.scrollTo(0,0);
}
async function renderClientsList(){
  const list=document.getElementById("clientsList");
  list.innerHTML='<div class="empty">Loading...</div>';
  try{
    const [onlineRes,gymRes]=await Promise.all([
      sb.from("profiles").select("id,full_name,onboarding_completed").eq("trainer_id",currentUser.id).eq("role","client"),
      sb.from("gym_clients").select("id,full_name,onboarding_completed").eq("trainer_id",currentUser.id)
    ]);
    if(onlineRes.error) throw onlineRes.error;
    if(gymRes.error) throw gymRes.error;
    const items=[
      ...(onlineRes.data||[]).map(c=>({...c,_kind:"online"})),
      ...(gymRes.data||[]).map(c=>({...c,_kind:"gym"}))
    ].sort((a,b)=>(a.full_name||"").localeCompare(b.full_name||""));
    if(!items.length){ list.innerHTML='<div class="empty">No clients yet.<br>Clients link automatically when they sign up and pick you as their trainer, or tap "+ Add Client" for someone you train in person.</div>'; return; }
    list.innerHTML=items.map(c=>`
      <div class="client-card" onclick="openClientProfile('${c.id}','${c._kind}')">
        <div>
          <div class="who">${esc(c.full_name)||"Unnamed client"}</div>
          <span class="badge" style="background:${c._kind==="online"?"#e5f5ed":"#fbe9d3"};color:${c._kind==="online"?"#1e7a45":"#9a4e0c"};margin-top:4px;display:inline-block">${c._kind==="online"?"Online":"Gym"}</span>
        </div>
        <span class="badge ${c.onboarding_completed?"badge-done":"badge-pending"}">${c.onboarding_completed?"✓ Onboarded":"Pending"}</span>
      </div>`).join("");
  }catch(e){
    console.error("renderClientsList failed:",e);
    list.innerHTML='<div class="empty">Couldn\'t load clients. Try again.</div>';
  }
}
function backToClientsList(){
  document.getElementById("clientProfileView").classList.add("hidden");
  document.getElementById("clientsListView").classList.remove("hidden");
}
async function openClientProfile(id,kind){
  document.getElementById("clientsListView").classList.add("hidden");
  document.getElementById("clientProfileView").classList.remove("hidden");
  const body=document.getElementById("clientProfileBody");
  const genBtn=document.getElementById("clientProfileGenerateBtn");
  const editBtn=document.getElementById("clientProfileEditBtn");
  genBtn.classList.add("hidden");
  editBtn.classList.add("hidden");
  body.innerHTML='<div class="empty">Loading...</div>';
  window.scrollTo(0,0);
  try{
    const table=kind==="gym"?"gym_clients":"profiles";
    const {data:c,error}=await sb.from(table).select("full_name,onboarding,onboarding_completed").eq("id",id).single();
    if(error) throw error;
    document.getElementById("clientProfileTitle").innerHTML=`<span class="dot"></span> ${esc(c.full_name)||"Client"}`;
    document.getElementById("clientProfileProgressBtn").onclick=()=>openProgressView(kind,id,c.full_name);
    document.getElementById("clientProfileFoodLogBtn").onclick=()=>openFoodLogView(kind,id,c.full_name);
    if(!c.onboarding_completed||!c.onboarding){
      body.innerHTML=kind==="gym"
        ?'<div class="empty">No onboarding info yet for this client.</div>'
        :'<div class="empty">This client hasn\'t completed onboarding yet.</div>';
      if(kind==="gym"){ editBtn.classList.remove("hidden"); editBtn.textContent="Fill Onboarding Form"; editBtn.onclick=()=>openEditGymClient(id,c.full_name,{}); }
      return;
    }
    genBtn.classList.remove("hidden");
    genBtn.onclick=()=>trainerGeneratePlanFor(id,kind);
    if(kind==="gym"){ editBtn.classList.remove("hidden"); editBtn.textContent="Edit Onboarding Info"; editBtn.onclick=()=>openEditGymClient(id,c.full_name,c.onboarding); }
    const o=c.onboarding;
    const rows=[
      ["Age",o.age],
      ["Goal",o.goal],
      ["Height",o.height?o.height+" cm":null],
      ["Weight",o.weight?o.weight+" kg":null],
      ["Experience",o.experience],
      ["Activity Level",o.activity],
      ["Time / Session",o.timeAvailable],
      ["Equipment",(o.equipment||[]).join(", ")],
      ["Dietary Restrictions",(o.dietaryRestrictions||[]).join(", ")],
      ["Injuries / Limitations",o.injury],
      ["Anything Else",o.extra]
    ].filter(([,v])=>v);
    body.innerHTML=rows.map(([lbl,val])=>`
      <div class="ob-summary-row"><div class="lbl">${lbl}</div><div class="val">${esc(String(val))}</div></div>`).join("");
  }catch(e){
    console.error("openClientProfile failed:",e);
    body.innerHTML='<div class="empty">Couldn\'t load this client. Try again.</div>';
  }
}

/* ====================== GYM CLIENTS (offline clients — trainer fills onboarding on their behalf) ====================== */
function openAddGymClient(){
  onboardingContext="gymAdd"; gymEditId=null;
  document.getElementById("obGymNameSection").classList.remove("hidden");
  document.getElementById("obGymName").value="";
  document.getElementById("obCancelBtn").classList.remove("hidden");
  document.getElementById("obSubmitBtn").textContent="Add Client";
  obEnabledKeys=Array.isArray(currentProfile.trainer_form)&&currentProfile.trainer_form.length
    ? Array.from(new Set([...currentProfile.trainer_form,...LOCKED_KEYS])) : QUESTION_DEFS.map(q=>q.key);
  document.getElementById("appWrap").classList.add("hidden");
  document.getElementById("onboardingView").classList.remove("hidden");
  renderOnboardingForm();
}
function openEditGymClient(id,name,existingOb){
  onboardingContext="gymEdit"; gymEditId=id;
  document.getElementById("obGymNameSection").classList.remove("hidden");
  document.getElementById("obGymName").value=name||"";
  document.getElementById("obCancelBtn").classList.remove("hidden");
  document.getElementById("obSubmitBtn").textContent="Save Changes";
  obEnabledKeys=Array.isArray(currentProfile.trainer_form)&&currentProfile.trainer_form.length
    ? Array.from(new Set([...currentProfile.trainer_form,...LOCKED_KEYS])) : QUESTION_DEFS.map(q=>q.key);
  document.getElementById("appWrap").classList.add("hidden");
  document.getElementById("onboardingView").classList.remove("hidden");
  renderOnboardingForm();
  // pre-fill with existing answers
  QUESTION_DEFS.filter(q=>obEnabledKeys.includes(q.key)).forEach(q=>{
    const val=existingOb?.[q.key];
    if(val==null) return;
    if(q.type==="chips"){
      (val||[]).forEach(v=>{
        const btn=[...document.querySelectorAll(`#ob_${q.key} .ob-chip`)].find(b=>b.textContent===v);
        if(btn){ obChipState[q.key].add(v); btn.classList.add("active"); }
      });
    } else {
      const el=document.getElementById(`ob_${q.key}`);
      if(el) el.value=val;
    }
  });
}
function cancelOnboardingEdit(){
  onboardingContext="self"; gymEditId=null;
  document.getElementById("onboardingView").classList.add("hidden");
  document.getElementById("appWrap").classList.remove("hidden");
  openClients();
}

/* ====================== PROGRESS TRACKING (measurements + photos + chart + PDF report) ======================
   Works for a client viewing their own progress, or a trainer viewing any linked client (online or gym). */
const MEASURE_FIELDS=[
  {key:"weight",label:"Weight",unit:"kg"},
  {key:"waist",label:"Waist",unit:"cm"},
  {key:"chest",label:"Chest",unit:"cm"},
  {key:"arms",label:"Arms",unit:"cm"},
  {key:"thighs",label:"Thighs",unit:"cm"},
  {key:"hips",label:"Hips",unit:"cm"}
];
let progressCtx={kind:"online",id:null,trainerId:null,label:""};
let progressOpenedFromClientProfile=false;
let progressEntries=[];

function openProgressView(kind,id,label){
  progressOpenedFromClientProfile = !(kind==="online" && id===null);
  if(kind==="online" && id===null){
    // client viewing their own progress
    progressCtx={kind:"online", id:currentUser.id, trainerId:currentProfile.trainer_id||null, label:currentProfile.full_name||"You"};
  } else {
    progressCtx={kind, id, trainerId:currentUser.id, label:label||"Client"};
  }
  document.getElementById("homeView").classList.add("hidden");
  document.getElementById("dietApp").classList.add("hidden");
  document.getElementById("workoutApp").classList.add("hidden");
  document.getElementById("clientHomeView").classList.add("hidden");
  document.getElementById("clientsListView").classList.add("hidden");
  document.getElementById("clientProfileView").classList.add("hidden");
  document.getElementById("progressLogView").classList.add("hidden");
  document.getElementById("progressView").classList.remove("hidden");
  document.getElementById("progressViewTitle").innerHTML=`<span class="dot"></span> ${esc(progressCtx.label)}'s Progress`;
  renderProgressView();
  window.scrollTo(0,0);
}
function backFromProgressView(){
  document.getElementById("progressView").classList.add("hidden");
  if(progressOpenedFromClientProfile){
    document.getElementById("clientProfileView").classList.remove("hidden");
  } else {
    document.getElementById("clientHomeView").classList.remove("hidden");
  }
}

async function fetchProgressEntries(){
  const {data,error}=await sb.from("measurements")
    .select("*").eq("client_kind",progressCtx.kind).eq("client_id",progressCtx.id)
    .order("logged_at",{ascending:true});
  if(error){ console.error("fetchProgressEntries failed:",error); return []; }
  return data||[];
}

async function renderProgressView(){
  const chartHolder=document.getElementById("progressChartHolder");
  const histList=document.getElementById("progressHistoryList");
  chartHolder.innerHTML='<div class="empty">Loading...</div>';
  histList.innerHTML="";
  try{
    progressEntries=await fetchProgressEntries();
    if(!progressEntries.length){
      chartHolder.innerHTML='<div class="empty">No entries yet. Tap "+ Log New Entry" to start tracking.</div>';
      histList.innerHTML="";
      return;
    }
    chartHolder.innerHTML=buildWeightChartSVG(progressEntries);
    // render newest-first history
    const entries=[...progressEntries].reverse();
    for(const e of entries){
      histList.insertAdjacentHTML("beforeend", renderProgressEntryCard(e));
    }
  }catch(err){
    console.error("renderProgressView failed:",err);
    chartHolder.innerHTML='<div class="empty">Couldn\'t load progress. Try again.</div>';
  }
}

function buildWeightChartSVG(entries){
  const pts=entries.filter(e=>e.weight!=null).map(e=>({date:e.logged_at, val:parseFloat(e.weight)}));
  if(pts.length<2) return '<div class="empty">Log at least 2 weight entries to see the trend line.</div>';
  const vals=pts.map(p=>p.val);
  const minV=Math.min(...vals), maxV=Math.max(...vals), range=(maxV-minV)||1;
  const W=320,H=160,pad=30;
  const cx=i=>pad+(i/(pts.length-1))*(W-pad*2);
  const cy=v=>H-pad-((v-minV)/range)*(H-pad*2);
  const line=pts.map((p,i)=>`${cx(i)},${cy(p.val)}`).join(" ");
  const dots=pts.map((p,i)=>`
    <circle cx="${cx(i)}" cy="${cy(p.val)}" r="5" fill="var(--teal)" stroke="#fff" stroke-width="2"/>
    <text x="${cx(i)}" y="${cy(p.val)-10}" text-anchor="middle" font-size="10" fill="var(--teal)" font-weight="700">${p.val}kg</text>
    <text x="${cx(i)}" y="${H-8}" text-anchor="middle" font-size="9" fill="#90a3a8">${new Date(p.date).toLocaleDateString(undefined,{day:"numeric",month:"short"})}</text>`).join("");
  const first=vals[0], last=vals[vals.length-1], diff=(last-first).toFixed(1);
  return `<svg viewBox="0 0 ${W} ${H}" style="width:100%;overflow:visible">
    <polyline points="${line}" fill="none" stroke="var(--teal-2)" stroke-width="2.5" stroke-linejoin="round"/>
    <line x1="${pad}" y1="${H-pad}" x2="${W-pad}" y2="${H-pad}" stroke="#e0e8ea" stroke-width="1"/>
    ${dots}
  </svg>
  <div style="text-align:center;font-size:12px;color:#7e9197;margin-top:4px">
    Start: <b>${first} kg</b> &nbsp;·&nbsp; Now: <b>${last} kg</b> &nbsp;·&nbsp; ${diff>0?"+"+diff:diff} kg
  </div>`;
}

function renderProgressEntryCard(entry){
  const idx=progressEntries.findIndex(e=>e.id===entry.id);
  const prev=idx>0?progressEntries[idx-1]:null;
  const date=new Date(entry.logged_at).toLocaleDateString(undefined,{day:"numeric",month:"short",year:"numeric"});
  const grid=MEASURE_FIELDS.filter(f=>entry[f.key]!=null).map(f=>{
    let trend="";
    if(prev && prev[f.key]!=null){
      const d=entry[f.key]-prev[f.key];
      if(Math.abs(d)>0.05) trend=`<div style="font-size:9px;font-weight:700" class="${d>0?'trend-up':'trend-down'}">${d>0?"+":""}${d.toFixed(1)}</div>`;
    }
    return `<div class="m"><div class="l">${f.label}</div><div class="v">${entry[f.key]}${f.unit}</div>${trend}</div>`;
  }).join("");
  return `<div class="prog-entry-card">
    <div class="prog-entry-date">${date}</div>
    ${grid?`<div class="prog-entry-grid">${grid}</div>`:""}
    ${entry.notes?`<div class="tip" style="margin-top:8px">${esc(entry.notes)}</div>`:""}
  </div>`;
}

/* ---- logging a new entry ---- */
function openProgressLog(){
  ["plWeight","plWaist","plChest","plArms","plThighs","plHips","plNotes"].forEach(id=>document.getElementById(id).value="");
  document.getElementById("plError").classList.add("hidden");
  document.getElementById("progressView").classList.add("hidden");
  document.getElementById("progressLogView").classList.remove("hidden");
  window.scrollTo(0,0);
}
function cancelProgressLog(){
  document.getElementById("progressLogView").classList.add("hidden");
  document.getElementById("progressView").classList.remove("hidden");
}
async function submitProgressLog(){
  const errEl=document.getElementById("plError");
  const btn=document.getElementById("plSubmitBtn");
  btn.disabled=true; btn.textContent="Saving...";
  try{
    const row={
      trainer_id: progressCtx.trainerId,
      client_kind: progressCtx.kind,
      client_id: progressCtx.id,
      logged_at: new Date().toISOString().slice(0,10),
      weight: document.getElementById("plWeight").value?parseFloat(document.getElementById("plWeight").value):null,
      waist: document.getElementById("plWaist").value?parseFloat(document.getElementById("plWaist").value):null,
      chest: document.getElementById("plChest").value?parseFloat(document.getElementById("plChest").value):null,
      arms: document.getElementById("plArms").value?parseFloat(document.getElementById("plArms").value):null,
      thighs: document.getElementById("plThighs").value?parseFloat(document.getElementById("plThighs").value):null,
      hips: document.getElementById("plHips").value?parseFloat(document.getElementById("plHips").value):null,
      notes: document.getElementById("plNotes").value.trim()||null
    };
    const {error}=await sb.from("measurements").insert(row);
    if(error) throw error;

    btn.disabled=false; btn.textContent="Save Entry";
    document.getElementById("progressLogView").classList.add("hidden");
    document.getElementById("progressView").classList.remove("hidden");
    toast("Entry saved");
    renderProgressView();
  }catch(e){
    console.error("submitProgressLog failed:",e);
    btn.disabled=false; btn.textContent="Save Entry";
    errEl.textContent="Couldn't save — try again.";
    errEl.classList.remove("hidden");
  }
}

/* ---- downloadable PDF report ---- */
async function downloadProgressReport(){
  if(!progressEntries.length){ toast("No entries to report yet"); return; }
  const chartSVG=buildWeightChartSVG(progressEntries);
  const latest=progressEntries[progressEntries.length-1];
  const first=progressEntries[0];
  const statRows=MEASURE_FIELDS.map(f=>{
    if(latest[f.key]==null) return "";
    const startVal=first[f.key]!=null?first[f.key]:latest[f.key];
    const diff=(latest[f.key]-startVal).toFixed(1);
    return `<tr style="border-bottom:1px solid #ede9e5;">
      <td style="padding:8px 14px;font-size:12.5px;font-weight:600">${f.label}</td>
      <td style="padding:8px 8px;text-align:center;font-size:12.5px">${startVal}${f.unit}</td>
      <td style="padding:8px 8px;text-align:center;font-size:12.5px;font-weight:700">${latest[f.key]}${f.unit}</td>
      <td style="padding:8px 14px;text-align:right;font-size:12.5px;font-weight:700;color:${diff>0?"#BB080B":"#25803a"}">${diff>0?"+":""}${diff}${f.unit}</td>
    </tr>`;
  }).join("");

  const bodyHTML=`
    <div style="margin:16px 24px 0;text-align:center">${chartSVG}</div>
    <div style="margin:16px 24px 0">
      <div style="background:#111;color:#fff;padding:9px 16px;font-weight:800;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;">MEASUREMENTS</div>
      <table style="width:100%;border-collapse:collapse">
        <thead><tr style="background:#F0EDE8">
          <th style="padding:7px 14px;text-align:left;font-size:10px;text-transform:uppercase;color:#555;font-weight:700">Metric</th>
          <th style="padding:7px 8px;text-align:center;font-size:10px;text-transform:uppercase;color:#555;font-weight:700">Start</th>
          <th style="padding:7px 8px;text-align:center;font-size:10px;text-transform:uppercase;color:#555;font-weight:700">Latest</th>
          <th style="padding:7px 14px;text-align:right;font-size:10px;text-transform:uppercase;color:#555;font-weight:700">Change</th>
        </tr></thead>
        <tbody>${statRows}</tbody>
      </table>
    </div>`;

  const date=new Date().toLocaleDateString(undefined,{day:"numeric",month:"long",year:"numeric"});
  mmPDFOpen(mmPDFShell(`${progressCtx.label} – Progress Report`,"Progress Report",progressCtx.label,"",date,bodyHTML,"Keep up the consistency — small changes compound over time."));
}

/* ====================== FOOD LOG (free-text, AI-matched via Edge Function) ====================== */
let foodLogCtx={kind:"online",id:null,trainerId:null,label:""};
let foodLogOpenedFromClientProfile=false;
let flReviewItems=[]; // [{rawText, qty, food, candidates, confidence}]

function openFoodLogView(kind,id,label){
  foodLogOpenedFromClientProfile = !(kind==="online" && id===null);
  if(kind==="online" && id===null){
    foodLogCtx={kind:"online", id:currentUser.id, trainerId:currentProfile.trainer_id||null, label:currentProfile.full_name||"You"};
  } else {
    foodLogCtx={kind, id, trainerId:currentUser.id, label:label||"Client"};
  }
  document.getElementById("homeView").classList.add("hidden");
  document.getElementById("dietApp").classList.add("hidden");
  document.getElementById("workoutApp").classList.add("hidden");
  document.getElementById("clientHomeView").classList.add("hidden");
  document.getElementById("clientsListView").classList.add("hidden");
  document.getElementById("clientProfileView").classList.add("hidden");
  document.getElementById("progressView").classList.add("hidden");
  document.getElementById("foodLogView").classList.remove("hidden");
  document.getElementById("foodLogTitle").innerHTML=`<span class="dot"></span> ${esc(foodLogCtx.label)}'s Food Log`;
  document.getElementById("flText").value="";
  document.getElementById("flError").classList.add("hidden");
  document.getElementById("flReviewSection").classList.add("hidden");
  flReviewItems=[];
  fillFoodDatalist();
  renderTodayFoodLog();
  window.scrollTo(0,0);
}
function backFromFoodLogView(){
  document.getElementById("foodLogView").classList.add("hidden");
  if(foodLogOpenedFromClientProfile){
    document.getElementById("clientProfileView").classList.remove("hidden");
  } else {
    document.getElementById("clientHomeView").classList.remove("hidden");
  }
}

async function parseFoodLogText(){
  const text=document.getElementById("flText").value.trim();
  const errEl=document.getElementById("flError");
  if(!text){ errEl.textContent="Type what you ate first"; errEl.classList.remove("hidden"); return; }
  errEl.classList.add("hidden");
  const btn=document.getElementById("flParseBtn"); btn.disabled=true; btn.textContent="Parsing...";
  try{
    const {data,error}=await sb.functions.invoke("parse-food-log",{body:{text, foodNames: FOODS.map(f=>f.name)}});
    if(error) throw error;
    if(data.error) throw new Error(data.error);
    flReviewItems=(data.items||[]).map(it=>({
      rawText: it.rawText||text,
      qty: it.qty||1,
      food: (it.confidence==="high" && it.matchedFood && byName[it.matchedFood]) ? it.matchedFood : null,
      candidates: (it.candidates||[]).filter(c=>byName[c]),
      confidence: it.confidence||"low"
    }));
    if(!flReviewItems.length){ errEl.textContent="Couldn't find any food items in that — try rewording"; errEl.classList.remove("hidden"); }
    renderFlReview();
  }catch(e){
    console.error("parseFoodLogText failed:",e);
    errEl.textContent="Couldn't parse that — try again"; errEl.classList.remove("hidden");
  }
  btn.disabled=false; btn.textContent="Parse & Log";
}

function renderFlReview(){
  const section=document.getElementById("flReviewSection");
  const list=document.getElementById("flReviewList");
  if(!flReviewItems.length){ section.classList.add("hidden"); return; }
  section.classList.remove("hidden");
  list.innerHTML=flReviewItems.map((it,i)=>{
    if(it.food){
      const f=byName[it.food];
      return `<div class="fl-review-card" style="background:#fff;border-color:var(--line)">
        <div style="font-size:13px;color:#7e9197;margin-bottom:8px">"${esc(it.rawText)}"</div>
        <div class="frow" style="grid-template-columns:1fr 72px">
          <input list="foodDatalist" value="${esc(it.food)}" oninput="flSetItemFood(${i},this.value)">
          <input type="number" value="${it.qty}" oninput="flSetItemQty(${i},this.value)">
        </div>
        <div class="tip">${f?f.unit:""} · will log as-is</div>
      </div>`;
    }
    return `<div class="fl-review-card">
      <div class="raw">Couldn't confidently match: "${esc(it.rawText)}"</div>
      <div class="fl-candidates">
        ${it.candidates.map(c=>`<button type="button" class="ob-chip" onclick="flResolveCandidate(${i},'${c.replace(/'/g,"\\'")}')">${esc(c)}</button>`).join("")}
      </div>
      <div style="margin-top:8px">
        <input list="foodDatalist" placeholder="Or search manually..." oninput="flSetItemFood(${i},this.value)">
      </div>
    </div>`;
  }).join("");
}
function flSetItemFood(i,val){ flReviewItems[i].food=val||null; }
function flSetItemQty(i,val){ flReviewItems[i].qty=parseFloat(val)||1; }
function flResolveCandidate(i,name){ flReviewItems[i].food=name; renderFlReview(); }

async function confirmAndSaveFoodLog(){
  const unresolved=flReviewItems.filter(it=>!it.food || !byName[it.food]);
  if(unresolved.length){ toast("Please match every item to a food first"); return; }
  const items=flReviewItems.map(it=>{
    const f=byName[it.food], q=it.qty||1;
    return { food:it.food, qty:q, p:+(f.p*q).toFixed(1), c:+(f.c*q).toFixed(1), fat:+(f.fat*q).toFixed(1), cal:+(f.cal*q).toFixed(0) };
  });
  try{
    const row={
      trainer_id: foodLogCtx.trainerId,
      client_kind: foodLogCtx.kind,
      client_id: foodLogCtx.id,
      logged_at: new Date().toISOString().slice(0,10),
      raw_text: document.getElementById("flText").value.trim(),
      items
    };
    const {error}=await sb.from("food_logs").insert(row);
    if(error) throw error;
    toast("Logged!");
    document.getElementById("flText").value="";
    document.getElementById("flReviewSection").classList.add("hidden");
    flReviewItems=[];
    renderTodayFoodLog();
  }catch(e){
    console.error("confirmAndSaveFoodLog failed:",e);
    toast("Couldn't save — try again");
  }
}

async function renderTodayFoodLog(){
  const totalsBar=document.getElementById("flTotalsBar");
  const list=document.getElementById("flTodayList");
  totalsBar.innerHTML=""; list.innerHTML='<div class="empty">Loading...</div>';
  try{
    const today=new Date().toISOString().slice(0,10);
    const {data,error}=await sb.from("food_logs").select("*")
      .eq("client_kind",foodLogCtx.kind).eq("client_id",foodLogCtx.id).eq("logged_at",today)
      .order("created_at",{ascending:true});
    if(error) throw error;
    const rows=data||[];
    const allItems=rows.flatMap(r=>r.items||[]);
    if(!allItems.length){
      totalsBar.innerHTML="";
      list.innerHTML='<div class="empty">Nothing logged today yet.</div>';
      return;
    }
    const totals=allItems.reduce((a,it)=>[a[0]+(it.p||0),a[1]+(it.c||0),a[2]+(it.fat||0),a[3]+(it.cal||0)],[0,0,0,0]);
    totalsBar.innerHTML=MACROS.map((m,i)=>`<div class="t"><div class="v">${i===3?r0(totals[i]):r1(totals[i])}</div><div class="l">${m}</div></div>`).join("");
    list.innerHTML=allItems.map(it=>`
      <div class="fl-log-row">
        <div><div class="name">${esc(it.food)}</div><div class="qty">${it.qty} ${byName[it.food]?byName[it.food].unit:""}</div></div>
        <div class="mac">${r0(it.cal)} kcal<br>${r1(it.p)}p·${r1(it.c)}c·${r1(it.fat)}f</div>
      </div>`).join("");
  }catch(e){
    console.error("renderTodayFoodLog failed:",e);
    list.innerHTML='<div class="empty">Couldn\'t load today\'s log.</div>';
  }
}

function openDiet(){ 
  document.getElementById("homeView").classList.add("hidden");
  document.getElementById("dietApp").classList.remove("hidden");
  document.getElementById("workoutApp").classList.add("hidden");
  renderLibrary(); show("lib");
}
function openWorkout(){
  document.getElementById("homeView").classList.add("hidden");
  document.getElementById("dietApp").classList.add("hidden");
  document.getElementById("workoutApp").classList.remove("hidden");
  woShowHome();
}
function woShowHome(){
  document.getElementById("woHome").classList.remove("hidden");
  document.getElementById("woAllSection").classList.add("hidden");
  document.getElementById("rmSection").classList.add("hidden");
  document.getElementById("customSection").classList.add("hidden");
  document.getElementById("wActionbar").classList.add("hidden");
  document.getElementById("rmAssignBar").classList.add("hidden");
  document.getElementById("rmPlanBar").classList.add("hidden");
  window.scrollTo(0,0);
}
function backToWoHome(){ woShowHome(); }
function openReadyMade(){
  document.getElementById("woHome").classList.add("hidden");
  document.getElementById("woAllSection").classList.add("hidden");
  document.getElementById("rmSection").classList.remove("hidden");
  document.getElementById("customSection").classList.add("hidden");
  rmRenderLibrary(); rmShow("lib");
}
function openCustom(){
  document.getElementById("woHome").classList.add("hidden");
  document.getElementById("woAllSection").classList.add("hidden");
  document.getElementById("rmSection").classList.add("hidden");
  document.getElementById("customSection").classList.remove("hidden");
  wRenderLibrary(); wShow("lib");
}

/* ====================== SAVED PLANS — combined Ready Made + Custom, sorted by date ====================== */
function openWoAll(){
  document.getElementById("woHome").classList.add("hidden");
  document.getElementById("rmSection").classList.add("hidden");
  document.getElementById("customSection").classList.add("hidden");
  document.getElementById("woAllSection").classList.remove("hidden");
  renderWoAllList();
  window.scrollTo(0,0);
}
async function renderWoAllList(){
  const list=document.getElementById("woAllList");
  list.innerHTML='<div class="empty">Loading...</div>';
  try{
    const [rmPlans,customPlans]=await Promise.all([Store.list(RM_PREFIX),Store.list(W_PREFIX)]);
    const items=[
      ...rmPlans.map(p=>({...p,_kind:"rm"})),
      ...customPlans.map(p=>({...p,_kind:"custom"}))
    ].sort((a,b)=>(b.updated||0)-(a.updated||0));

    if(!items.length){ list.innerHTML='<div class="empty">No saved plans yet.<br>Create one from Ready Made or Custom.</div>'; return; }

    list.innerHTML=items.map(p=>{
      const d=new Date(p.updated||Date.now());
      const date=d.toLocaleDateString(undefined,{day:"numeric",month:"short",year:"numeric"});
      if(p._kind==="rm"){
        return `<div class="plan-card" onclick="woAllOpenPlan('${p.id}','rm')">
          <div>
            <span class="kind-tag kind-workout" style="margin-bottom:5px">Ready Made</span>
            <div class="who">${esc(p.client)||"Untitled"}</div>
            <div class="meta">${esc(p.templateName)||""} · ${esc(p.templateTag)||""} · ${date}</div>
          </div>
          <div style="display:flex;align-items:center;">
            <button class="del" onclick="event.stopPropagation();woAllDeletePlan('${p.id}','rm')">🗑</button>
          </div></div>`;
      }
      const exCount=(p.exercises||[]).length;
      return `<div class="plan-card" onclick="woAllOpenPlan('${p.id}','custom')">
        <div>
          <span class="kind-tag" style="background:#e8d5f7;color:#6b2fa0;margin-bottom:5px">Custom</span>
          <div class="who">${esc(p.client)||"Untitled"}</div>
          <div class="meta">${esc(p.goal)||"—"} · ${exCount} ex · ${date}</div>
        </div>
        <div style="display:flex;align-items:center;">
          <button class="del" onclick="event.stopPropagation();woAllDeletePlan('${p.id}','custom')">🗑</button>
        </div></div>`;
    }).join("");
  }catch(e){
    console.error("renderWoAllList failed:",e);
    list.innerHTML='<div class="empty">Couldn\'t load plans. Pull to refresh or try again.</div>';
  }
}
async function woAllOpenPlan(id,kind){
  document.getElementById("woAllSection").classList.add("hidden");
  if(kind==="rm"){
    document.getElementById("customSection").classList.add("hidden");
    document.getElementById("rmSection").classList.remove("hidden");
    await rmOpenPlan(id);
  } else {
    document.getElementById("rmSection").classList.add("hidden");
    document.getElementById("customSection").classList.remove("hidden");
    await wOpenPlan(id);
  }
}
async function woAllDeletePlan(id,kind){
  if(kind==="rm"){
    const all=await Store.list(RM_PREFIX);
    const p=all.find(x=>x.id===id);
    if(confirm(`Delete ${p&&p.client||"this plan"}? This can't be undone.`)){ await Store.remove(id,RM_PREFIX); renderWoAllList(); }
  } else {
    const all=await Store.list(W_PREFIX);
    const p=all.find(x=>x.id===id);
    if(confirm(`Delete ${p&&p.client||"this plan"}? This can't be undone.`)){ await Store.remove(id,W_PREFIX); renderWoAllList(); }
  }
}
function show(view){
  document.getElementById("libView").classList.toggle("hidden",view!=="lib");
  document.getElementById("editView").classList.toggle("hidden",view!=="edit");
  document.getElementById("actionbar").classList.toggle("hidden",view!=="edit");
  window.scrollTo(0,0);
}
async function backToLibrary(){
  if(isClientMode()){ gotoClientHome(); return; }
  if(dirty && plan){ if(confirm("Save changes before leaving?")) await savePlan(true); }
  plan=null; dirty=false; await renderLibrary(); show("lib");
}
function newPlan(){ plan=blankPlan(); dirty=false; renderEditor(); show("edit"); }
async function openPlan(id){ const all=await Store.list("plan:"); plan=all.find(p=>p.id===id)||blankPlan(); dirty=false; renderEditor(); show("edit"); }
async function deletePlan(id){
  const all=await Store.list("plan:");
  const p=all.find(x=>x.id===id);
  if(confirm(`Delete ${p&&p.client||"this plan"}? This can't be undone.`)){ await Store.remove(id,"plan:"); renderLibrary(); }
}

/* ====================== EDITOR RENDER ====================== */
function renderEditor(){
  document.getElementById("client").value=plan.client||"";
  document.getElementById("goal").value=plan.goal||"";
  renderTargets(); renderProgress(); renderMeals();
}
function renderTargets(){
  document.getElementById("targets").innerHTML = MACROS.map((m,i)=>`
    <div class="tbox"><div class="lab">${m}</div>
      <input type="number" inputmode="numeric" min="0" value="${plan.targets[i]||""}" placeholder="0"
        oninput="setTarget(${i},this.value)"></div>`).join("");
}
function renderProgress(){
  const day=dayTotals();
  document.getElementById("progress").innerHTML = MACROS.map((m,i)=>{
    const tgt=plan.targets[i]||0, used=day[i], pct=tgt>0?Math.min(100,used/tgt*100):0;
    const over=tgt>0&&used>tgt*1.001, rem=tgt-used, u=MUNIT[i];
    const usedTxt=i===3?r0(used):r1(used), tgtTxt=tgt?(i===3?r0(tgt):r1(tgt)):"—";
    let left = !tgt?"set a target above":(over?`${i===3?r0(-rem):r1(-rem)} ${u} over`:`${i===3?r0(rem):r1(rem)} ${u} left`);
    return `<div class="pbox">
      <div class="name">${m}</div>
      <div class="used">${usedTxt}<small> / ${tgtTxt} ${u}</small></div>
      <div class="bar"><span style="width:${pct}%;background:${over?'var(--amber)':'var(--teal-2)'}"></span></div>
      <div class="left ${over?'over':''}">${left}</div></div>`;
  }).join("");
}
function renderMeals(){
  fillFoodDatalist();
  document.getElementById("meals").innerHTML = plan.meals.map((m,mi)=>{
    const rows=m.items.map((it,ri)=>{ const f=byName[it.food], mac=rowMacros(it), unit=f?f.unit:"";
      return `<div class="frow">
        <input list="foodDatalist" placeholder="Search food..." value="${esc(it.food)}"
          oninput="setFood(${mi},${ri},this.value)">
        <div class="qtywrap">
          <input type="number" inputmode="decimal" min="0" placeholder="qty" value="${it.qty}" oninput="setQty(${mi},${ri},this.value)">
          <span class="unit" id="unit-${mi}-${ri}">${unit||''}</span>
        </div>
        <div class="mac" id="mac-${mi}-${ri}"><b>${r0(mac[3])}</b> kcal<br>${r1(mac[0])}p·${r1(mac[1])}c·${r1(mac[2])}f</div>
        <button class="rmrow" onclick="rmRow(${mi},${ri})">×</button></div>`;
    }).join("");
    const t=mealTotals(m);
    return `<div class="meal">
      <div class="meal-head">
        <input value="${esc(m.name)}" onchange="setMealName(${mi},this.value)">
        <button class="iconbtn" onclick="rmMeal(${mi})" title="delete meal">🗑</button></div>
      <div class="rows">${rows}<button class="add-food" onclick="addRow(${mi})">+ Add food</button></div>
      <div class="meal-sub" id="sub-${mi}"><span>${r1(t[0])}P</span><span>${r1(t[1])}C</span><span>${r1(t[2])}F</span><span>${r0(t[3])} kcal</span></div>
    </div>`;
  }).join("");
}

/* ====================== EDIT ACTIONS ====================== */
function markDirty(){ dirty=true; plan.client=document.getElementById("client").value; plan.goal=document.getElementById("goal").value; }
function setTarget(i,v){ plan.targets[i]=parseFloat(v)||0; dirty=true; renderProgress(); }
function setMealName(mi,v){ plan.meals[mi].name=v; dirty=true; }
function setFood(mi,ri,v){
  plan.meals[mi].items[ri].food=v; dirty=true;
  const f=byName[v], mac=rowMacros(plan.meals[mi].items[ri]);
  const macEl=document.getElementById(`mac-${mi}-${ri}`);
  if(macEl) macEl.innerHTML=`<b>${r0(mac[3])}</b> kcal<br>${r1(mac[0])}p·${r1(mac[1])}c·${r1(mac[2])}f`;
  const unitSpan=document.getElementById(`unit-${mi}-${ri}`);
  if(unitSpan) unitSpan.textContent=f?f.unit:"";
  const t=mealTotals(plan.meals[mi]);
  const sub=document.getElementById(`sub-${mi}`);
  if(sub) sub.innerHTML=`<span>${r1(t[0])}P</span><span>${r1(t[1])}C</span><span>${r1(t[2])}F</span><span>${r0(t[3])} kcal</span>`;
  renderProgress();
}
function setQty(mi,ri,v){
  plan.meals[mi].items[ri].qty=v; dirty=true;
  const mac=rowMacros(plan.meals[mi].items[ri]);
  const el=document.getElementById(`mac-${mi}-${ri}`);
  if(el) el.innerHTML=`<b>${r0(mac[3])}</b> kcal<br>${r1(mac[0])}p·${r1(mac[1])}c·${r1(mac[2])}f`;
  const t=mealTotals(plan.meals[mi]);
  const sub=document.getElementById(`sub-${mi}`);
  if(sub) sub.innerHTML=`<span>${r1(t[0])}P</span><span>${r1(t[1])}C</span><span>${r1(t[2])}F</span><span>${r0(t[3])} kcal</span>`;
  renderProgress();
}
function addRow(mi){ plan.meals[mi].items.push({food:"",qty:""}); dirty=true; renderMeals(); }
function rmRow(mi,ri){ plan.meals[mi].items.splice(ri,1); if(!plan.meals[mi].items.length) plan.meals[mi].items.push({food:"",qty:""}); dirty=true; renderMeals(); renderProgress(); }
function addMeal(){ plan.meals.push({name:"Meal "+(plan.meals.length+1),items:[{food:"",qty:""}]}); dirty=true; renderMeals(); }
function rmMeal(mi){ if(plan.meals.length<=1) return toast("Keep at least one meal"); plan.meals.splice(mi,1); dirty=true; renderMeals(); renderProgress(); }

async function savePlan(silent){
  plan.client=document.getElementById("client").value.trim();
  plan.goal=document.getElementById("goal").value.trim();
  if(!plan.client){ if(!silent){ toast("Add a client name first"); document.getElementById("client").focus(); } return; }
  plan.updated=Date.now();
  const ok=await Store.save(plan,"plan:"); dirty=false;
  if(!silent) toast(ok?"Plan saved":"Saved locally (this session)");
}

/* ====================== PDF SHELL (MUSCLE MATTERS BRAND) ====================== */
function mmPDFShell(title,subtitle,clientName,goal,dateStr,bodyHTML,footerNote){
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Montserrat',Arial,sans-serif;background:#fff;color:#1a1a1a}
    @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
  </style></head><body>
  <div style="max-width:760px;margin:0 auto;">
    <div style="background:#111;padding:20px 28px;text-align:center;">
      <div style="font-size:20px;font-weight:900;letter-spacing:5px;text-transform:uppercase;color:#fff;">MUSCLE MATTERS</div>
      <div style="font-size:9px;letter-spacing:2.5px;opacity:.65;margin-top:5px;text-transform:uppercase;color:#fff;">${subtitle}</div>
    </div>
    <div style="height:5px;background:#BB080B;"></div>
    <div style="padding:18px 28px 16px;background:#fff;border-bottom:1px solid #e8e4e0;display:flex;justify-content:space-between;align-items:flex-end;">
      <div>
        <div style="font-size:22px;font-weight:900;letter-spacing:.5px;">${clientName}</div>
        ${goal?`<div style="display:inline-block;margin-top:8px;background:#BB080B;color:#fff;padding:3px 14px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">${goal}</div>`:""}
      </div>
      <div style="font-size:11px;color:#999;font-weight:600;">${dateStr}</div>
    </div>
    ${bodyHTML}
    <div style="background:#F0EDE8;padding:13px 28px;display:flex;align-items:center;justify-content:space-between;margin-top:8px;">
      <div style="font-size:10px;color:#888;letter-spacing:.3px;">${footerNote}</div>
      <div style="font-size:9px;font-weight:900;letter-spacing:2.5px;color:#BB080B;">MUSCLE MATTERS</div>
    </div>
  </div>
  <script>document.fonts.ready.then(()=>{window.focus();window.print()});<\/script>
  </body></html>`;
}
function mmPDFOpen(shell){ const w=window.open("","_blank"); if(!w){toast("Allow pop-ups to save PDF");return;} w.document.write(shell); w.document.close(); }

/* ====================== PDF EXPORT ====================== */
function exportPDF(){
  const client=document.getElementById("client").value.trim()||"Client";
  const goal=document.getElementById("goal").value.trim();
  const day=dayTotals();
  const date=new Date().toLocaleDateString(undefined,{day:"numeric",month:"long",year:"numeric"});

  const mealsHTML=plan.meals.map(m=>{
    const items=m.items.filter(it=>byName[it.food]&&parseFloat(it.qty)>0);
    if(!items.length) return "";
    const t=mealTotals(m);
    const rows=items.map((it,idx)=>{ const f=byName[it.food], mc=rowMacros(it);
      return `<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 16px;background:${idx%2?"#F0EDE8":"#fff"};border-bottom:1px solid #ede9e5;font-size:12.5px;">
        <span style="flex:1;font-weight:600">${esc(f.name)}</span>
        <span style="color:#999;width:80px;text-align:right">${it.qty} ${f.unit}</span>
        <span style="font-weight:700;width:80px;text-align:right">${r0(mc[3])} kcal</span></div>`;
    }).join("");
    return `<div style="margin:12px 24px 0">
      <div style="background:#111;color:#fff;padding:9px 16px;font-weight:800;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;display:flex;align-items:center;gap:10px;">
        <span style="display:inline-block;width:3px;height:16px;background:#BB080B;border-radius:2px;flex:none"></span>${esc(m.name)}</div>
      ${rows}
      <div style="padding:7px 16px;background:#F0EDE8;font-size:11px;text-align:right;color:#555;font-weight:700;border-top:1px solid #ddd;">
        ${r1(t[0])}g P · ${r1(t[1])}g C · ${r1(t[2])}g F · <span style="color:#BB080B;font-weight:800">${r0(t[3])} kcal</span></div></div>`;
  }).join("");

  const tgt=plan.targets;
  const tgtLine=tgt[3]>0?` · Target: ${r0(tgt[3])} kcal`:"";
  const bodyHTML=`${mealsHTML}
    <div style="margin:16px 24px 8px;background:#BB080B;color:#fff;padding:14px 18px;display:flex;justify-content:space-between;align-items:center;font-weight:800;font-size:13px;letter-spacing:.5px;">
      <span>DAY TOTAL${tgtLine}</span>
      <span>${r1(day[0])}P · ${r1(day[1])}C · ${r1(day[2])}F · ${r0(day[3])} kcal</span></div>`;

  mmPDFOpen(mmPDFShell(`${client} – Nutrition Plan`,"Personalized Nutrition Plan",client,goal,date,bodyHTML,"Follow portions as listed. Reach out to your coach before making changes."));
}
function printFallback(html){ const w=window.open("","_blank"); if(!w){toast("Allow pop-ups");return;} w.document.write(`<html><body style="margin:0">${html}</body></html>`); w.document.close(); setTimeout(()=>{w.focus();w.print();},300); }

function toast(msg){ const t=document.getElementById("toast"); t.textContent=msg; t.classList.add("show"); setTimeout(()=>t.classList.remove("show"),1900); }

/* ====================== READY MADE PLAN TEMPLATES ====================== */
// [sets, mainReps, squatPct, benchPct, dlPct, ohpPct, varReps, varPct, pausedReps]
const SBD3_WK=[
  [3,8,.65,.65,.65,.60,7,.60,6],[3,8,.67,.67,.67,.62,7,.62,6],[3,8,.69,.69,.69,.64,7,.64,6],
  [3,6,.75,.72,.75,.67,5,.70,4],[3,6,.77,.74,.77,.69,5,.72,4],[3,6,.79,.76,.79,.71,5,.74,4],
  [3,5,.82,.80,.82,.75,4,.77,3],[3,5,.84,.82,.84,.77,4,.79,3],[3,5,.86,.84,.86,.79,4,.81,3],
  [3,3,.87,.87,.87,.82,2,.82,2],[3,3,.87,.87,.87,.82,2,.82,2],[3,1,.92,.92,.92,.87,2,.87,2]
];
// 4-day Day4: [speedDL_reps, speedDL_pct, ohp_reps, ohp_pct]
const SBD4_D4_WK=[
  [6,.60,8,.55],[6,.60,8,.57],[6,.60,8,.59],[4,.60,6,.62],[4,.60,6,.64],[4,.60,6,.66],
  [3,.60,5,.70],[3,.60,5,.72],[3,.60,5,.74],[2,.60,3,.77],[2,.60,3,.77],[2,.60,1,.82]
];
function rmKg(oneRM,pct){ return oneRM>0 ? Math.round(oneRM*pct/2.5)*2.5 : null; }
function rmLoadStr(oneRM,pct){ const k=rmKg(oneRM,pct); return k?k+" kg":"—"; }

const RM_TEMPLATES=[
  { id:"sbd_3day", name:"12-Week SBD Strength", tag:"3 Days / Week",
    desc:"Squat, Bench & Deadlift focus. Progressive overload 65%→92% 1RM.",
    lifts:["Squat","Bench","Deadlift","OHP"], weeks:12,
    getDays(wi,rm){
      const [sets,reps,sqP,bP,dlP,ohpP,vReps,vP,pReps]=SBD3_WK[wi];
      return [
        { name:"Day 1 – Squat + Bench", exercises:[
          {name:"Back Squat (comp)",warmup:1,sets,reps,rest:"2–3 min",load:rmKg(rm.Squat,sqP),pct:sqP},
          {name:"Bench Press (comp)",warmup:1,sets,reps,rest:"2–3 min",load:rmKg(rm.Bench,bP),pct:bP},
          {name:"Paused Squat",warmup:0,sets:3,reps:pReps,rest:"2–3 min",load:null,pct:null},
          {name:"Incline DB Press",warmup:0,sets:3,reps:10,rest:"1–2 min",load:null,pct:null},
          {name:"Row (Chest-Supported)",warmup:0,sets:3,reps:12,rest:"1–2 min",load:null,pct:null}]},
        { name:"Day 2 – Deadlift + OHP", exercises:[
          {name:"Deadlift (comp)",warmup:1,sets,reps,rest:"2–3 min",load:rmKg(rm.Deadlift,dlP),pct:dlP},
          {name:"Overhead Press",warmup:1,sets,reps,rest:"2–3 min",load:rmKg(rm.OHP,ohpP),pct:ohpP},
          {name:"RDL",warmup:0,sets:3,reps:8,rest:"2 min",load:null,pct:null},
          {name:"Lat Pulldown",warmup:0,sets:3,reps:12,rest:"1–2 min",load:null,pct:null},
          {name:"Back Extension",warmup:0,sets:3,reps:12,rest:"1–2 min",load:null,pct:null}]},
        { name:"Day 3 – Squat + Bench (Vol/Tech)", exercises:[
          {name:"Front/Paused Squat",warmup:1,sets:3,reps:vReps,rest:"2–3 min",load:rmKg(rm.Squat,vP),pct:vP},
          {name:"Speed Bench",warmup:1,sets:3,reps:3,rest:"2–3 min",load:rmKg(rm.Bench,.60),pct:.60},
          {name:"Leg Press",warmup:0,sets:3,reps:12,rest:"1–2 min",load:null,pct:null},
          {name:"Triceps Pressdown",warmup:0,sets:3,reps:12,rest:"1–2 min",load:null,pct:null},
          {name:"Core (Cable Crunch/Plank)",warmup:0,sets:3,reps:"12–15",rest:"1–2 min",load:null,pct:null}]}
      ];
    }},
  { id:"sbd_4day", name:"12-Week SBD Strength", tag:"4 Days / Week",
    desc:"Heavy + volume/speed days. Squat, Bench, Deadlift & OHP over 12 weeks.",
    lifts:["Squat","Bench","Deadlift","OHP"], weeks:12,
    getDays(wi,rm){
      const [sets,reps,sqP,bP,dlP,ohpP,vReps,vP,pReps]=SBD3_WK[wi];
      const [sdR,sdP,ovR,ovP]=SBD4_D4_WK[wi];
      return [
        { name:"Day 1 – Squat + Bench (Heavy)", exercises:[
          {name:"Back Squat (comp)",warmup:1,sets,reps,rest:"2–3 min",load:rmKg(rm.Squat,sqP),pct:sqP},
          {name:"Bench Press (comp)",warmup:1,sets,reps,rest:"2–3 min",load:rmKg(rm.Bench,bP),pct:bP},
          {name:"Paused Squat",warmup:0,sets:3,reps:pReps,rest:"2–3 min",load:null,pct:null},
          {name:"DB Row",warmup:0,sets:3,reps:10,rest:"1–2 min",load:null,pct:null}]},
        { name:"Day 2 – Deadlift + OHP (Heavy)", exercises:[
          {name:"Deadlift (comp)",warmup:1,sets,reps,rest:"2–3 min",load:rmKg(rm.Deadlift,dlP),pct:dlP},
          {name:"Overhead Press (comp)",warmup:1,sets,reps,rest:"2–3 min",load:rmKg(rm.OHP,ohpP),pct:ohpP},
          {name:"RDL",warmup:0,sets:3,reps:8,rest:"2 min",load:null,pct:null},
          {name:"Face Pull",warmup:0,sets:3,reps:15,rest:"60–90s",load:null,pct:null}]},
        { name:"Day 3 – Squat + Bench (Vol/Speed)", exercises:[
          {name:"Front/Paused Squat",warmup:1,sets:3,reps:vReps,rest:"2–3 min",load:rmKg(rm.Squat,vP),pct:vP},
          {name:"Speed Bench",warmup:1,sets:3,reps:3,rest:"2–3 min",load:rmKg(rm.Bench,.60),pct:.60},
          {name:"Leg Press",warmup:0,sets:3,reps:12,rest:"1–2 min",load:null,pct:null},
          {name:"Hamstring Curl",warmup:0,sets:3,reps:12,rest:"1–2 min",load:null,pct:null}]},
        { name:"Day 4 – Deadlift + OHP (Vol/Speed)", exercises:[
          {name:"Speed Deadlift",warmup:1,sets:3,reps:sdR,rest:"2–3 min",load:rmKg(rm.Deadlift,sdP),pct:sdP},
          {name:"Overhead Press",warmup:1,sets:3,reps:ovR,rest:"2–3 min",load:rmKg(rm.OHP,ovP),pct:ovP},
          {name:"Back Extension",warmup:0,sets:3,reps:12,rest:"1–2 min",load:null,pct:null},
          {name:"Lat Pulldown",warmup:0,sets:3,reps:12,rest:"1–2 min",load:null,pct:null}]}
      ];
    }}
];

/* ====================== READY MADE PLAN STATE ====================== */
const RM_PREFIX="rmplan:";
let rmPlan=null, rmDirty=false, rmActiveWeek=0, rmActiveTemplate=null;
let rmSlots=[null,null], rmActiveSlot=0;

function rmBlankPlan(tpl){ return {
  id:"rm"+Date.now()+Math.floor(Math.random()*999),
  templateId:tpl.id, templateName:tpl.name, templateTag:tpl.tag,
  client:"", goal:"", injury:"", clientUserId:null,
  rm:{Squat:0,Bench:0,Deadlift:0,OHP:0},
  accessories:{}, logs:{}, currentWeek:0, updated:Date.now()
};}

function rmShow(view){
  ["rmLibView","rmTemplates","rmAssignView","rmPlanView"].forEach(id=>
    document.getElementById(id).classList.toggle("hidden",id!=="rm"+view.charAt(0).toUpperCase()+view.slice(1)+"View"&&id!=="rmTemplates"||true));
  document.getElementById("rmLibView").classList.toggle("hidden",view!=="lib");
  document.getElementById("rmTemplates").classList.toggle("hidden",view!=="templates");
  document.getElementById("rmAssignView").classList.toggle("hidden",view!=="assign");
  document.getElementById("rmPlanView").classList.toggle("hidden",view!=="plan");
  document.getElementById("rmAssignBar").classList.toggle("hidden",view!=="assign");
  document.getElementById("rmPlanBar").classList.toggle("hidden",view!=="plan");
  window.scrollTo(0,0);
}

async function rmRenderLibrary(){
  const plans=await Store.list(RM_PREFIX);
  const list=document.getElementById("rmPlanList");
  if(!plans.length){ list.innerHTML='<div class="empty">No assigned plans yet.<br>Tap "+ Assign a plan" to start.</div>'; return; }
  list.innerHTML=plans.map(p=>`
    <div class="plan-card" onclick="rmOpenPlan('${p.id}')">
      <div>
        <div class="who">${esc(p.client)||"Untitled"}</div>
        <div class="meta">${esc(p.templateTag)||""} · Wk ${(p.currentWeek||0)+1} · ${new Date(p.updated||Date.now()).toLocaleDateString(undefined,{day:"numeric",month:"short"})}</div>
      </div>
      <div style="display:flex;align-items:center;">
        <div class="kcal" style="font-size:11px;color:#7e9197;text-align:right">${esc(p.templateName)||""}</div>
        <button class="del" onclick="event.stopPropagation();rmDeletePlan('${p.id}')">🗑</button>
      </div></div>`).join("");
}

function showRmTemplates(){
  document.getElementById("rmTemplateList").innerHTML=RM_TEMPLATES.map((t,i)=>`
    <div class="tpl-card" onclick="rmSelectTemplate(${i})">
      <div>
        <div class="tname">${esc(t.name)}</div>
        <div class="ttag">${esc(t.tag)}</div>
        <div class="tdesc">${esc(t.desc)}</div>
      </div>
      <span style="font-size:22px;margin-left:10px">›</span>
    </div>`).join("");
  rmShow("templates");
}

async function rmSelectTemplate(i){
  rmActiveTemplate=RM_TEMPLATES[i];
  rmPlan=rmBlankPlan(rmActiveTemplate);
  rmDirty=false;
  await rmRenderAssign();
  rmShow("assign");
}

async function rmRenderAssign(){
  document.getElementById("rmClient").value=rmPlan.client||"";
  document.getElementById("rmGoal").value=rmPlan.goal||"";
  document.getElementById("rmInjury").value=rmPlan.injury||"";
  document.getElementById("rmInputs").innerHTML=rmActiveTemplate.lifts.map(l=>`
    <div class="tbox"><div class="lab">${l}</div>
      <input type="number" inputmode="decimal" min="0" placeholder="0 kg"
        value="${rmPlan.rm[l]||""}" oninput="rmSetLift('${l}',this.value)"></div>`).join("");
  // load trainer's linked clients
  const picker=document.getElementById("rmClientPicker");
  picker.innerHTML='<option value="">— none, just type a name below —</option>';
  if(currentUser){
    const {data:clients}=await sb.from("profiles").select("id,full_name").eq("trainer_id",currentUser.id).eq("role","client");
    (clients||[]).forEach(c=>{
      const opt=document.createElement("option");
      opt.value=c.id; opt.textContent=c.full_name||"Unnamed client";
      if(rmPlan.clientUserId===c.id) opt.selected=true;
      picker.appendChild(opt);
    });
  }
}
function rmPickClient(clientId){
  rmPlan.clientUserId=clientId||null;
  if(clientId){
    const sel=document.getElementById("rmClientPicker");
    const opt=sel.options[sel.selectedIndex];
    document.getElementById("rmClient").value=opt.textContent;
    rmPlan.client=opt.textContent;
  }
  rmDirty=true;
}

function rmMarkDirty(){ rmDirty=true; }
function rmSetLift(l,v){ rmPlan.rm[l]=parseFloat(v)||0; rmDirty=true; }

async function rmSaveAssign(){
  rmPlan.client=document.getElementById("rmClient").value.trim();
  rmPlan.goal=document.getElementById("rmGoal").value.trim();
  rmPlan.injury=document.getElementById("rmInjury").value.trim();
  if(!rmPlan.client){ toast("Add a client name first"); document.getElementById("rmClient").focus(); return; }
  rmPlan.updated=Date.now();
  await Store.save(rmPlan,RM_PREFIX);
  rmDirty=false;
  rmActiveWeek=rmPlan.currentWeek||0;
  rmSlots[rmActiveSlot]=rmPlan;
  rmRenderPlan();
  rmShow("plan");
}

async function rmOpenPlan(id){
  const all=await Store.list(RM_PREFIX);
  rmPlan=all.find(p=>p.id===id);
  if(!rmPlan) return;
  rmActiveTemplate=RM_TEMPLATES.find(t=>t.id===rmPlan.templateId)||RM_TEMPLATES[0];
  rmActiveWeek=rmPlan.currentWeek||0;
  rmSlots[rmActiveSlot]=rmPlan;
  rmRenderPlan();
  rmShow("plan");
}

/* two-client slot switcher (trainer-only, for running two clients' sessions side by side) */
function rmRenderSlotTabs(){
  const el=document.getElementById("rmSlotTabs");
  if(!el) return;
  if(isClientMode()){ el.style.display="none"; return; }
  el.style.display="";
  el.innerHTML=[0,1].map(i=>{
    const p=rmSlots[i], active=i===rmActiveSlot?" active":"";
    if(p){
      return `<div class="slot-tab-wrap">
        <button class="slot-tab${active}" onclick="rmSwitchSlot(${i})">${esc(p.client||"Client "+(i+1))}</button>
        <button class="slot-change" onclick="rmChangeSlot(${i})" title="Load a different client here">⇄</button>
      </div>`;
    }
    return `<button class="slot-tab empty${active}" onclick="rmChangeSlot(${i})">+ Client ${i+1}</button>`;
  }).join("");
}
function rmSwitchSlot(i){
  if(!rmSlots[i]){ rmChangeSlot(i); return; }
  rmActiveSlot=i;
  rmPlan=rmSlots[i];
  rmActiveTemplate=RM_TEMPLATES.find(t=>t.id===rmPlan.templateId)||RM_TEMPLATES[0];
  rmActiveWeek=rmPlan.currentWeek||0;
  rmRenderPlan();
}
function rmChangeSlot(i){
  rmActiveSlot=i;
  rmRenderLibrary();
  rmShow("lib");
}
function rmPlanBack(){
  if(isClientMode()){ gotoClientHome(); return; }
  rmShow("lib");
}

async function rmDeletePlan(id){
  const all=await Store.list(RM_PREFIX);
  const p=all.find(x=>x.id===id);
  if(confirm(`Delete ${p&&p.client||"this plan"}? This can't be undone.`)){ await Store.remove(id,RM_PREFIX); rmRenderLibrary(); }
}

function rmRenderPlan(){
  const tpl=rmActiveTemplate;
  document.getElementById("rmPlanTitle").innerHTML=`<span class="dot"></span> ${esc(rmPlan.client||"Plan")}`;
  rmRenderSlotTabs();
  const inj=rmPlan.injury||"";
  const injBox=document.getElementById("rmViewInjury");
  if(inj){ injBox.style.display=""; injBox.innerHTML=`<label>⚠ Injuries / Limitations</label><div style="font-size:13px;color:#7b1717;margin-top:4px">${esc(inj)}</div>`; }
  else injBox.style.display="none";
  // Week tabs
  document.getElementById("rmWeekTabs").innerHTML=Array.from({length:tpl.weeks},(_,i)=>
    `<button class="wtab${i===rmActiveWeek?" active":""}" onclick="rmSelectWeek(${i})">W${i+1}</button>`).join("");
  rmRenderDays();
}

function rmSelectWeek(wi){ rmActiveWeek=wi; rmPlan.currentWeek=wi; rmDirty=true; rmRenderPlan(); }

function rmRenderDays(){
  fillExerciseDatalist();
  const tpl=rmActiveTemplate;
  const days=tpl.getDays(rmActiveWeek,rmPlan.rm);
  if(!rmPlan.logs) rmPlan.logs={};
  if(!rmPlan.sessions) rmPlan.sessions={};

  const daysHTML=days.map((day,di)=>{
    const key=`w${rmActiveWeek}d${di}`;
    const status=(rmPlan.sessions[key]||{}).status||"not_started";
    const logs=rmPlan.logs[key]||{};
    const accs=rmPlan.accessories[key]||[];

    const statusBadge=status==="completed"
      ?`<span class="day-status done">✓ DONE</span>`
      :status==="active"?`<span class="day-status active">● ACTIVE</span>`:"";

    // PREVIEW MODE (not started or completed summary)
    if(status!=="active"){
      const exSummary=day.exercises.map(ex=>`
        <div style="padding:7px 12px;border-bottom:1px solid var(--mist);display:flex;justify-content:space-between;align-items:center">
          <div>
            <span style="font-size:13px;font-weight:600">${esc(ex.name)}</span>
            <span style="font-size:11px;color:#7e9197;margin-left:8px">${ex.sets}×${ex.reps}</span>
          </div>
          <div style="text-align:right">
            ${ex.load!=null?`<span style="font-size:13px;font-weight:700;color:var(--teal)">${ex.load} kg</span>`:""}
            ${ex.pct?`<span style="font-size:10px;color:#7e9197;margin-left:4px">${Math.round(ex.pct*100)}%</span>`:""}
          </div>
        </div>`).join("");
      const accSummary=accs.filter(a=>a.name).map(a=>`
        <div style="padding:6px 12px;border-bottom:1px solid var(--mist);display:flex;justify-content:space-between">
          <span style="font-size:12px;color:#555">${esc(a.name)}</span>
          <span style="font-size:11px;color:#7e9197">${a.sets&&a.reps?a.sets+"×"+a.reps:""}</span>
        </div>`).join("");
      const actionBtn=status==="completed"
        ?`<button class="start-btn" style="background:#2f8f5b" onclick="rmStartWorkout('${key}')">↩ Redo Workout</button>`
        :`<button class="start-btn" onclick="rmStartWorkout('${key}')">▶ Start Workout</button>`;
      return `<div class="day-card" id="daycard-${key}">
        <div class="day-head">${esc(day.name)} ${statusBadge}</div>
        ${exSummary}${accSummary}
        ${actionBtn}
      </div>`;
    }

    // ACTIVE LOGGING MODE
    const exBlocks=day.exercises.map((ex,ei)=>{
      const exLog=logs[`e${ei}`]||[];
      const sets=parseInt(ex.sets)||3;
      const setRows=Array.from({length:sets},(_,si)=>{
        const s=exLog[si]||{};
        const done=!!s.done;
        return `<div class="set-row${done?" set-done":""}" id="sr-${key}-${ei}-${si}">
          <div class="set-num">Set ${si+1}</div>
          <input class="set-input" type="number" inputmode="decimal" placeholder="${ex.load||'kg'}"
            value="${esc(s.weight||'')}"
            oninput="rmSetVal('${key}','e${ei}',${si},'weight',this.value)">
          <input class="set-input" type="number" inputmode="numeric" placeholder="${ex.reps}"
            value="${esc(s.reps||'')}"
            oninput="rmSetVal('${key}','e${ei}',${si},'reps',this.value)">
          <button class="set-check${done?" checked":""}" onclick="rmToggleSet('${key}','e${ei}',${si})">
            ${done?"✓":""}
          </button>
        </div>`;
      }).join("");
      const pctStr=ex.pct?` · ${Math.round(ex.pct*100)}% 1RM`:"";
      const targetStr=ex.load!=null?` · Target: ${ex.load} kg`:"";
      return `<div class="ex-block">
        <div class="ex-header">
          <div>
            ${ex.warmup?`<span class="ex-warmup" style="font-size:10px;color:var(--amber-ink);background:var(--amber-soft);padding:2px 7px;border-radius:10px;font-weight:600">+1 warm-up</span> `:""}
            <span class="ex-name">${esc(ex.name)}</span>
            <div class="ex-detail">${ex.sets} sets · ${ex.reps} reps · ${esc(ex.rest)}${pctStr}${targetStr}</div>
          </div>
          <button class="progress-btn" onclick="rmShowProgress('${esc(ex.name)}')">📊</button>
        </div>
        <div class="set-headers"><span>SET</span><span style="text-align:center">WEIGHT</span><span style="text-align:center">REPS</span><span></span></div>
        ${setRows}
        <div class="set-spacer"></div>
      </div>`;
    }).join("");

    // ACCESSORY BLOCKS (with superset grouping)
    const accBlocks=rmRenderAccActive(key,accs,logs);

    const allSets=day.exercises.reduce((t,ex)=>t+parseInt(ex.sets||3),0)
      +accs.reduce((t,a)=>t+parseInt(a.sets||3),0);
    const doneSets=day.exercises.reduce((t,ex,ei)=>{
      const l=logs[`e${ei}`]||[]; return t+l.filter(s=>s.done).length;
    },0)+accs.reduce((t,a,ai)=>{
      const l=logs[`a${ai}`]||[]; return t+l.filter(s=>s.done).length;
    },0);
    const pct=allSets>0?Math.round(doneSets/allSets*100):0;

    return `<div class="day-card" id="daycard-${key}">
      <div class="day-head">${esc(day.name)} ${statusBadge}</div>
      ${pct>0?`<div style="height:4px;background:var(--line)"><div style="height:4px;background:var(--good);width:${pct}%;transition:width .3s"></div></div>`:""}
      ${exBlocks}
      ${accBlocks}
      <div class="acc-add-row">
        <button class="acc-add-btn acc-add-normal" onclick="rmAddAcc('${key}')">+ Add exercise</button>
      </div>
      <button class="complete-btn" onclick="rmCompleteWorkout('${key}',${di},${days.length})">✓ Complete Workout</button>
    </div>`;
  }).join("");

  // completion banner check
  const allDone=days.every((_,di)=>(rmPlan.sessions[`w${rmActiveWeek}d${di}`]||{}).status==="completed");
  const banner=allDone?`<div class="complete-banner">
    <div class="big">🏆</div>
    <div class="msg">Week ${rmActiveWeek+1} Complete!</div>
    <div class="sub">All workouts finished for this week.</div>
    ${rmActiveWeek<rmActiveTemplate.weeks-1?`<button class="next-btn" onclick="rmSelectWeek(${rmActiveWeek+1})">Next → Week ${rmActiveWeek+2}</button>`:""}
  </div>`:"";

  document.getElementById("rmDays").innerHTML=daysHTML+banner;
}

function rmRenderAccActive(key,accs,logs){
  if(!accs.length) return "";
  // group by ssGroup
  const groups=[];
  let lastGroup=null;
  accs.forEach((a,ai)=>{
    if(a.ssGroup&&a.ssGroup===lastGroup&&groups.length){
      groups[groups.length-1].items.push({a,ai});
    } else {
      groups.push({type:a.ssGroup?a.ssType||"superset":null,id:a.ssGroup,items:[{a,ai}]});
      lastGroup=a.ssGroup||null;
    }
  });

  return `<div class="acc-block" style="border-top:1px dashed var(--line)">
    ${groups.map(g=>{
      if(!g.type){
        return g.items.map(({a,ai})=>rmRenderAccRow(key,a,ai,logs)).join("");
      }
      const labelMap={superset:"SUPERSET",triset:"TRISET",giantset:"GIANT SET"};
      const brMap={superset:"ss-superset-br",triset:"ss-triset-br",giantset:"ss-giantset-br"};
      const lbMap={superset:"ss-superset",triset:"ss-triset",giantset:"ss-giantset"};
      return `<div class="ss-group" style="position:relative;padding-left:14px;margin:0">
        <div class="ss-bracket ${brMap[g.type]}" style="position:absolute;left:4px;top:0;bottom:0;width:4px;border-radius:4px"></div>
        <div class="ss-label-row" style="padding:6px 12px 2px 14px;display:flex;align-items:center;gap:8px">
          <span class="ss-label ${lbMap[g.type]}">${labelMap[g.type]||"SUPERSET"}</span>
        </div>
        ${g.items.map(({a,ai})=>rmRenderAccRow(key,a,ai,logs)).join("")}
      </div>`;
    }).join("")}
  </div>`;
}

function rmRenderAccRow(key,a,ai,logs){
  const aLog=logs[`a${ai}`]||[];
  const sets=parseInt(a.sets)||3;
  const setRows=Array.from({length:sets},(_,si)=>{
    const s=aLog[si]||{};
    const done=!!s.done;
    return `<div class="set-row${done?" set-done":""}" id="sr-${key}-a${ai}-${si}">
      <div class="set-num">Set ${si+1}</div>
      <input class="set-input" type="number" inputmode="decimal" placeholder="kg"
        value="${esc(s.weight||'')}"
        oninput="rmSetVal('${key}','a${ai}',${si},'weight',this.value)">
      <input class="set-input" type="number" inputmode="numeric" placeholder="${a.reps||'reps'}"
        value="${esc(s.reps||'')}"
        oninput="rmSetVal('${key}','a${ai}',${si},'reps',this.value)">
      <button class="set-check${done?" checked":""}" onclick="rmToggleSet('${key}','a${ai}',${si})">
        ${done?"✓":""}
      </button>
    </div>`;
  }).join("");
  return `<div class="ex-block">
    <div class="ex-header">
      <div>
        <div class="ex-name">
          <input list="exerciseDatalist" value="${esc(a.name)}" placeholder="Search exercise..."
            style="border:none;background:transparent;font-size:14px;font-weight:700;width:100%;padding:0"
            oninput="rmSetAcc('${key}',${ai},'name',this.value)">
        </div>
        <div style="display:flex;gap:8px;margin-top:4px">
          <input type="number" placeholder="Sets" value="${esc(a.sets)}"
            style="width:52px;padding:5px 6px;border:1px solid var(--line);border-radius:8px;font-size:12px;text-align:center"
            oninput="rmSetAcc('${key}',${ai},'sets',this.value);rmRenderDays()">
          <input placeholder="Reps" value="${esc(a.reps)}"
            style="width:52px;padding:5px 6px;border:1px solid var(--line);border-radius:8px;font-size:12px;text-align:center"
            oninput="rmSetAcc('${key}',${ai},'reps',this.value)">
        </div>
      </div>
      <button class="rmrow" style="font-size:18px;background:none;border:none;color:#b14;cursor:pointer;padding:4px" onclick="rmRemoveAcc('${key}',${ai})">×</button>
    </div>
    <div class="set-headers"><span>SET</span><span style="text-align:center">WEIGHT</span><span style="text-align:center">REPS</span><span></span></div>
    ${setRows}
    <div class="set-spacer"></div>
  </div>`;
}

/* session controls */
function rmStartWorkout(key){
  if(!rmPlan.sessions) rmPlan.sessions={};
  rmPlan.sessions[key]={status:"active",startedAt:Date.now()};
  rmDirty=true; rmRenderDays();
  setTimeout(()=>document.getElementById("daycard-"+key)?.scrollIntoView({behavior:"smooth",block:"start"}),50);
}

function rmCompleteWorkout(key,di,totalDays){
  if(!rmPlan.sessions) rmPlan.sessions={};
  rmPlan.sessions[key]={...rmPlan.sessions[key]||{},status:"completed",completedAt:Date.now()};
  rmDirty=true;
  Store.save(rmPlan,RM_PREFIX);
  rmRenderDays();
  // scroll to next day or banner
  const nextKey=`w${rmActiveWeek}d${di+1}`;
  setTimeout(()=>{
    if(di+1<totalDays){
      document.getElementById("daycard-"+nextKey)?.scrollIntoView({behavior:"smooth",block:"start"});
    } else {
      window.scrollTo({top:document.body.scrollHeight,behavior:"smooth"});
    }
  },100);
}

/* set logging */
function rmSetVal(dayKey,exKey,si,field,val){
  if(!rmPlan.logs) rmPlan.logs={};
  if(!rmPlan.logs[dayKey]) rmPlan.logs[dayKey]={};
  if(!rmPlan.logs[dayKey][exKey]) rmPlan.logs[dayKey][exKey]=[];
  if(!rmPlan.logs[dayKey][exKey][si]) rmPlan.logs[dayKey][exKey][si]={};
  rmPlan.logs[dayKey][exKey][si][field]=val; rmDirty=true;
}

function rmToggleSet(dayKey,exKey,si){
  if(!rmPlan.logs) rmPlan.logs={};
  if(!rmPlan.logs[dayKey]) rmPlan.logs[dayKey]={};
  if(!rmPlan.logs[dayKey][exKey]) rmPlan.logs[dayKey][exKey]=[];
  if(!rmPlan.logs[dayKey][exKey][si]) rmPlan.logs[dayKey][exKey][si]={};
  const s=rmPlan.logs[dayKey][exKey][si];
  s.done=!s.done; rmDirty=true;
  // update just this row without full re-render
  const row=document.getElementById(`sr-${dayKey}-${exKey}-${si}`);
  if(row){ row.className="set-row"+(s.done?" set-done":"");
    const btn=row.querySelector(".set-check");
    if(btn){ btn.className="set-check"+(s.done?" checked":""); btn.textContent=s.done?"✓":""; }
    row.querySelectorAll(".set-input").forEach(inp=>{ inp.style.background=s.done?"#f0faf5":""; inp.style.borderColor=s.done?"#b8e0cb":""; inp.style.color=s.done?"var(--good)":""; });
  }
  // update progress bar
  updateDayProgress(dayKey);
}

function updateDayProgress(key){
  const tpl=rmActiveTemplate;
  const days=tpl.getDays(rmActiveWeek,rmPlan.rm);
  const di=parseInt(key.split("d")[1]);
  const day=days[di]; if(!day) return;
  const logs=rmPlan.logs[key]||{};
  const accs=rmPlan.accessories[key]||[];
  const allSets=day.exercises.reduce((t,ex)=>t+parseInt(ex.sets||3),0)+accs.reduce((t,a)=>t+parseInt(a.sets||3),0);
  const doneSets=day.exercises.reduce((t,ex,ei)=>{ const l=logs[`e${ei}`]||[]; return t+l.filter(s=>s.done).length; },0)+accs.reduce((t,a,ai)=>{ const l=logs[`a${ai}`]||[]; return t+l.filter(s=>s.done).length; },0);
  const pct=allSets>0?Math.round(doneSets/allSets*100):0;
  const card=document.getElementById("daycard-"+key);
  if(!card) return;
  let bar=card.querySelector(".progress-fill");
  if(!bar){
    const wrap=document.createElement("div");
    wrap.style.cssText="height:4px;background:var(--line)";
    wrap.innerHTML=`<div class="progress-fill" style="height:4px;background:var(--good);width:${pct}%;transition:width .3s"></div>`;
    card.querySelector(".day-head").after(wrap);
  } else { bar.style.width=pct+"%"; }
}

/* superset grouping */
function rmAddAcc(key){
  if(!rmPlan.accessories[key]) rmPlan.accessories[key]=[];
  rmPlan.accessories[key].push({name:"",sets:"3",reps:"",weight:""});
  rmDirty=true; rmRenderDays();
}
function rmSetAcc(key,i,field,val){ if(rmPlan.accessories[key]) rmPlan.accessories[key][i][field]=val; rmDirty=true; }
function rmRemoveAcc(key,i){ rmPlan.accessories[key].splice(i,1); rmDirty=true; rmRenderDays(); }

/* progress chart */
function rmShowProgress(exName){
  const tpl=rmActiveTemplate;
  const dataPoints=[];
  for(let wi=0;wi<tpl.weeks;wi++){
    const days=tpl.getDays(wi,rmPlan.rm);
    days.forEach((day,di)=>{
      const key=`w${wi}d${di}`;
      const logs=(rmPlan.logs&&rmPlan.logs[key])||{};
      day.exercises.forEach((ex,ei)=>{
        if(ex.name===exName){
          const exLog=logs[`e${ei}`]||[];
          const weights=exLog.filter(s=>s.weight).map(s=>parseFloat(s.weight));
          if(weights.length) dataPoints.push({week:wi+1,max:Math.max(...weights)});
        }
      });
    });
  }

  let chartHTML="";
  if(dataPoints.length<2){
    chartHTML=`<div style="text-align:center;padding:30px;color:#7e9197;font-size:14px">
      Log at least 2 weeks of ${exName} to see your progress chart.</div>`;
  } else {
    const weeks=dataPoints.map(d=>d.week);
    const vals=dataPoints.map(d=>d.max);
    const minV=Math.min(...vals), maxV=Math.max(...vals);
    const range=maxV-minV||1;
    const W=320,H=160,pad=30;
    const cx=i=>pad+(i/(dataPoints.length-1))*(W-pad*2);
    const cy=v=>H-pad-((v-minV)/range)*(H-pad*2);
    const pts=dataPoints.map((d,i)=>`${cx(i)},${cy(d.max)}`).join(" ");
    const dots=dataPoints.map((d,i)=>`
      <circle cx="${cx(i)}" cy="${cy(d.max)}" r="5" fill="var(--teal)" stroke="#fff" stroke-width="2"/>
      <text x="${cx(i)}" y="${cy(d.max)-10}" text-anchor="middle" font-size="10" fill="var(--teal)" font-weight="700">${d.max}kg</text>
      <text x="${cx(i)}" y="${H-8}" text-anchor="middle" font-size="9" fill="#90a3a8">W${d.week}</text>`).join("");
    chartHTML=`<svg viewBox="0 0 ${W} ${H}" style="width:100%;overflow:visible">
      <polyline points="${pts}" fill="none" stroke="var(--teal-2)" stroke-width="2.5" stroke-linejoin="round"/>
      <line x1="${pad}" y1="${H-pad}" x2="${W-pad}" y2="${H-pad}" stroke="#e0e8ea" stroke-width="1"/>
      ${dots}
    </svg>
    <div style="text-align:center;font-size:12px;color:#7e9197;margin-top:4px">
      Best: <b style="color:var(--teal)">${Math.max(...vals)} kg</b> &nbsp;·&nbsp; Started: <b>${Math.min(...vals)} kg</b> &nbsp;·&nbsp; +${(Math.max(...vals)-Math.min(...vals)).toFixed(1)} kg
    </div>`;
  }

  const overlay=document.createElement("div");
  overlay.className="prog-overlay";
  overlay.onclick=e=>{ if(e.target===overlay) overlay.remove(); };
  overlay.innerHTML=`<div class="prog-sheet">
    <button class="prog-close" onclick="this.closest('.prog-overlay').remove()">✕</button>
    <h3>${esc(exName)}</h3>
    <div class="prog-sub">Weight logged per week (kg)</div>
    ${chartHTML}
  </div>`;
  document.body.appendChild(overlay);
}

async function rmSavePlan(){
  rmPlan.updated=Date.now();
  await Store.save(rmPlan,RM_PREFIX); rmDirty=false; toast("Plan saved");
}

function rmExportPDF(){
  const tpl=rmActiveTemplate;
  const client=rmPlan.client||"Client";
  const days=tpl.getDays(rmActiveWeek,rmPlan.rm);
  const date=new Date().toLocaleDateString(undefined,{day:"numeric",month:"long",year:"numeric"});
  const inj=rmPlan.injury||"";

  const injHTML=inj?`<div style="margin:12px 24px;background:#fff5f5;border-left:4px solid #BB080B;padding:10px 14px;">
    <div style="font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#BB080B;font-weight:800;margin-bottom:4px;">⚠ Injuries / Limitations</div>
    <div style="font-size:12.5px;color:#7b1717;">${esc(inj)}</div></div>`:"";

  const rmBar=`<div style="margin:10px 24px 0;padding:8px 14px;background:#F0EDE8;font-size:11px;color:#555;display:flex;gap:20px;flex-wrap:wrap;font-weight:600;">
    ${tpl.lifts.map(l=>`<span><span style="color:#888">1RM ${l}:</span> ${rmPlan.rm[l]||0} kg</span>`).join("")}
  </div>`;

  const daysHTML=days.map((day,di)=>{
    const logKey=`w${rmActiveWeek}d${di}`;
    const logs=(rmPlan.logs&&rmPlan.logs[logKey])||{};
    const accs=(rmPlan.accessories[logKey]||[]).filter(a=>a.name);
    const exRows=day.exercises.map((ex,ei)=>{
      const exLog=logs[`e${ei}`]||[];
      const bestW=exLog.filter(s=>s.weight).map(s=>parseFloat(s.weight));
      const loggedW=bestW.length?Math.max(...bestW)+" kg":"—";
      const prescribed=`${ex.sets}×${ex.reps}${ex.pct?' @ '+Math.round(ex.pct*100)+'%':''}`;
      const targetStr=ex.load!=null?ex.load+" kg":"—";
      const bg=ei%2?"#F0EDE8":"#fff";
      return `<tr style="border-bottom:1px solid #ede9e5;background:${bg}">
        <td style="padding:8px 14px;font-size:12.5px">${ex.warmup?'<span style="background:#fde;color:#9a4e0c;font-size:9px;font-weight:700;padding:1px 6px;border-radius:6px;margin-right:5px;letter-spacing:.5px">WARM-UP</span>':''}${esc(ex.name)}</td>
        <td style="padding:8px 6px;text-align:center;font-size:11.5px;color:#555;font-weight:600">${prescribed}<br><span style="color:#999;font-size:10px">Target: ${targetStr}</span></td>
        <td style="padding:8px 6px;text-align:center;font-size:12px">${esc(ex.rest)}</td>
        <td style="padding:8px 14px;text-align:right;font-weight:800;font-size:13px;color:${loggedW!=="—"?"#BB080B":"#ccc"}">${loggedW}</td>
      </tr>`;}).join("");
    const accRowsHTML=accs.map((a,ai)=>{
      const aLog=logs[`a${ai}`]||[];
      const bestW=aLog.filter(s=>s.weight).map(s=>parseFloat(s.weight));
      const loggedW=bestW.length?Math.max(...bestW)+" kg":"";
      return `<tr style="border-bottom:1px solid #ede9e5;background:#fafcfc">
        <td style="padding:8px 14px;font-size:12px;color:#555">${esc(a.name)}</td>
        <td style="padding:8px 6px;text-align:center;font-size:11.5px;color:#888">${a.sets&&a.reps?a.sets+"×"+a.reps:""}</td>
        <td style="padding:8px 6px"></td>
        <td style="padding:8px 14px;text-align:right;font-weight:700;font-size:12px;color:#BB080B">${loggedW}</td>
      </tr>`;}).join("");
    return `<div style="margin:12px 24px 0">
      <div style="background:#111;color:#fff;padding:9px 16px;font-weight:800;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;display:flex;align-items:center;gap:10px;">
        <span style="display:inline-block;width:3px;height:16px;background:#BB080B;border-radius:2px;flex:none"></span>${esc(day.name)}</div>
      <table style="width:100%;border-collapse:collapse">
        <thead><tr style="background:#F0EDE8">
          <th style="padding:7px 14px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#555;font-weight:700">Exercise</th>
          <th style="padding:7px 6px;text-align:center;font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#555;font-weight:700">Prescribed</th>
          <th style="padding:7px 6px;text-align:center;font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#555;font-weight:700">Rest</th>
          <th style="padding:7px 14px;text-align:right;font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#555;font-weight:700">Logged</th>
        </tr></thead>
        <tbody>${exRows}${accRowsHTML}</tbody>
      </table></div>`;
  }).join("");

  const extraBadges=`<div style="display:inline-block;margin-left:8px;background:#F0EDE8;color:#555;padding:3px 12px;border-radius:20px;font-size:10px;font-weight:700;letter-spacing:.5px;text-transform:uppercase">${esc(tpl.tag)}</div>
  <div style="display:inline-block;margin-left:6px;background:#111;color:#fff;padding:3px 12px;border-radius:20px;font-size:10px;font-weight:700;letter-spacing:.5px">WEEK ${rmActiveWeek+1} / ${tpl.weeks}</div>`;

  const bodyHTML=`${injHTML}${rmBar}${daysHTML}<div style="height:12px"></div>`;

  // Custom goal line with extra badges
  const goalWithBadges=(rmPlan.goal||"")+extraBadges;
  mmPDFOpen(mmPDFShell(`${client} – Week ${rmActiveWeek+1}`,"12-Week Strength Program",client,goalWithBadges,date,bodyHTML,"Train within noted limits. Message your coach before making any changes to the program."));
}

/* ====================== WORKOUT TOOL ====================== */
const W_PREFIX = "wplan:";
let wPlan = null, wDirty = false;

function wBlankPlan(){ return { id:"w"+Date.now()+Math.floor(Math.random()*999),
  client:"", goal:"", injury:"",
  exercises:[{name:"",sets:"",reps:"",rest:"",weight:"",notes:"",ssGroup:null,ssType:null}], updated:Date.now() }; }

function wShow(view){
  document.getElementById("wLibView").classList.toggle("hidden",view!=="lib");
  document.getElementById("wEditView").classList.toggle("hidden",view!=="edit");
  document.getElementById("wActionbar").classList.toggle("hidden",view!=="edit");
  window.scrollTo(0,0);
}
async function wRenderLibrary(){
  const list = document.getElementById("wPlanList");
  try{
    const plans = await Store.list(W_PREFIX);
    if(!plans.length){ list.innerHTML='<div class="empty">No saved plans yet.<br>Tap "New plan" to make your first one.</div>'; return; }
    list.innerHTML = plans.map(p=>`
      <div class="plan-card" onclick="wOpenPlan('${p.id}')">
        <div>
          <div class="who">${esc(p.client)||"Untitled"}</div>
          <div class="meta">${esc(p.goal)||"—"} · ${new Date(p.updated||Date.now()).toLocaleDateString(undefined,{day:"numeric",month:"short"})}</div>
        </div>
        <div style="display:flex;align-items:center;">
          <div class="kcal" style="font-size:12px;color:#7e9197">${(p.exercises||[]).length} ex</div>
          <button class="del" onclick="event.stopPropagation();wDeletePlan('${p.id}')">🗑</button>
        </div></div>`).join("");
  }catch(e){
    console.error("wRenderLibrary failed:",e);
    list.innerHTML='<div class="empty">Couldn\'t load plans. Try again.</div>';
  }
}
function wNewPlan(){ wPlan=wBlankPlan(); wDirty=false; wRenderEditor(); wShow("edit"); }
async function wOpenPlan(id){ const all=await Store.list(W_PREFIX); wPlan=all.find(p=>p.id===id)||wBlankPlan(); wDirty=false; wRenderEditor(); wShow("edit"); }
async function wDeletePlan(id){
  const all=await Store.list(W_PREFIX);
  const p=all.find(x=>x.id===id);
  if(confirm(`Delete ${p&&p.client||"this plan"}? This can't be undone.`)){ await Store.remove(id,W_PREFIX); wRenderLibrary(); }
}
async function wBackToLibrary(){
  if(isClientMode()){ gotoClientHome(); return; }
  if(wDirty && wPlan){ if(confirm("Save changes before leaving?")) await wSavePlan(true); }
  wPlan=null; wDirty=false;
  wShow("lib");
  await wRenderLibrary();
}
function wMarkDirty(){ wDirty=true; if(wPlan){ wPlan.client=document.getElementById("wClient").value; wPlan.goal=document.getElementById("wGoal").value; wPlan.injury=document.getElementById("wInjury").value; } }

function wRenderEditor(){
  document.getElementById("wClient").value=wPlan.client||"";
  document.getElementById("wGoal").value=wPlan.goal||"";
  document.getElementById("wInjury").value=wPlan.injury||"";
  wRenderExercises();
}
function wRenderExercises(){
  fillExerciseDatalist();
  const exs=wPlan.exercises;
  // group consecutive exercises by ssGroup
  const blocks=[];
  exs.forEach((ex,i)=>{
    if(ex.ssGroup && blocks.length && blocks[blocks.length-1].group===ex.ssGroup){
      blocks[blocks.length-1].items.push({ex,i});
    } else {
      blocks.push({group:ex.ssGroup||null,type:ex.ssType||null,items:[{ex,i}]});
    }
  });

  const typeLabel={superset:"SUPERSET",triset:"TRISET",giantset:"GIANT SET"};
  const typeBrColor={superset:"#9b59b6",triset:"#2980b9",giantset:"#27ae60"};
  const typeBg={superset:"#e8d5f7",triset:"#d5e8f7",giantset:"#d5f7e8"};
  const typeColor={superset:"#6b2fa0",triset:"#1a5fa0",giantset:"#1a7a40"};

  document.getElementById("wExList").innerHTML=blocks.map(block=>{
    const rows=block.items.map(({ex,i})=>`
      <div class="exrow" style="${block.group?"padding-left:8px":""}">
        <input list="exerciseDatalist" placeholder="Search exercise..." value="${esc(ex.name)}" oninput="wSetEx(${i},'name',this.value)">
        <input type="number" inputmode="numeric" placeholder="Sets" value="${esc(ex.sets)}" oninput="wSetEx(${i},'sets',this.value)" style="text-align:center">
        <input placeholder="Reps" value="${esc(ex.reps)}" oninput="wSetEx(${i},'reps',this.value)" style="text-align:center">
        <input placeholder="kg" value="${esc(ex.weight)}" oninput="wSetEx(${i},'weight',this.value)" style="text-align:center">
        <input placeholder="Rest" value="${esc(ex.rest)}" oninput="wSetEx(${i},'rest',this.value)" style="text-align:center">
        <button class="rmrow" onclick="wRmEx(${i})">×</button>
        <div class="ex-notes" style="grid-column:1/-1">
          <input placeholder="Notes (optional)" value="${esc(ex.notes)}" oninput="wSetEx(${i},'notes',this.value)">
        </div>
      </div>`).join("");

    if(!block.group) return rows;

    // grouped block with bracket
    const lastIdx=block.items[block.items.length-1].i;
    return `<div style="position:relative;padding-left:12px;margin:4px 0">
      <div style="position:absolute;left:0;top:0;bottom:0;width:4px;border-radius:4px;background:${typeBrColor[block.type]||'#9b59b6'}"></div>
      <div style="display:flex;align-items:center;gap:8px;padding:4px 0 4px 4px">
        <span style="font-size:10px;font-weight:800;letter-spacing:.8px;text-transform:uppercase;
          background:${typeBg[block.type]};color:${typeColor[block.type]};padding:2px 8px;border-radius:8px">
          ${typeLabel[block.type]||"SUPERSET"}
        </span>
        <button onclick="wAddToGroup('${block.group}','${block.type}')"
          style="font-size:11px;font-weight:700;background:none;border:1px solid ${typeBrColor[block.type]};
          color:${typeBrColor[block.type]};border-radius:8px;padding:2px 8px;cursor:pointer">+ Add</button>
      </div>
      ${rows}
    </div>`;
  }).join("");
}

function wSetEx(i,field,val){ wPlan.exercises[i][field]=val; wDirty=true; }

function wAddEx(group=null,type=null){
  wPlan.exercises.push({name:"",sets:"",reps:"",rest:"",weight:"",notes:"",ssGroup:group,ssType:type});
  wDirty=true; wRenderExercises();
}

function wAddGroup(type){
  const groupId="g"+Date.now();
  const count=type==="giantset"?4:type==="triset"?3:2;
  for(let i=0;i<count;i++)
    wPlan.exercises.push({name:"",sets:"",reps:"",rest:"",weight:"",notes:"",ssGroup:groupId,ssType:type});
  wDirty=true; wRenderExercises();
}

function wAddToGroup(groupId,type){
  // find last exercise in this group and insert after it
  let lastIdx=-1;
  wPlan.exercises.forEach((ex,i)=>{ if(ex.ssGroup===groupId) lastIdx=i; });
  wPlan.exercises.splice(lastIdx+1,0,{name:"",sets:"",reps:"",rest:"",weight:"",notes:"",ssGroup:groupId,ssType:type});
  wDirty=true; wRenderExercises();
}

function wRmEx(i){
  if(wPlan.exercises.length<=1) return toast("Keep at least one exercise");
  wPlan.exercises.splice(i,1); wDirty=true; wRenderExercises();
}

async function wSavePlan(silent){
  wPlan.client=document.getElementById("wClient").value.trim();
  wPlan.goal=document.getElementById("wGoal").value.trim();
  wPlan.injury=document.getElementById("wInjury").value.trim();
  if(!wPlan.client){ if(!silent){ toast("Add a client name first"); document.getElementById("wClient").focus(); } return; }
  wPlan.updated=Date.now();
  const ok=await Store.save(wPlan,W_PREFIX); wDirty=false;
  if(!silent) toast(ok?"Plan saved":"Saved locally (this session)");
}

function wExportPDF(){
  const client=document.getElementById("wClient").value.trim()||"Client";
  const goal=document.getElementById("wGoal").value.trim();
  const injury=document.getElementById("wInjury").value.trim();
  const date=new Date().toLocaleDateString(undefined,{day:"numeric",month:"long",year:"numeric"});

  const injuryHTML=injury?`<div style="margin:12px 24px;background:#fff5f5;border-left:4px solid #BB080B;padding:10px 14px;">
    <div style="font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#BB080B;font-weight:800;margin-bottom:4px;">⚠ Injuries / Limitations</div>
    <div style="font-size:12.5px;color:#7b1717;">${esc(injury)}</div></div>`:"";

  const ssTypeLabel={superset:"SUPERSET",triset:"TRISET",giantset:"GIANT SET"};
  const filtered=wPlan.exercises.filter(ex=>ex.name);
  const exRows=filtered.map((ex,idx)=>{
    const prevEx=filtered[idx-1];
    const groupStart=ex.ssGroup&&(!prevEx||prevEx.ssGroup!==ex.ssGroup);
    const labelHTML=groupStart?`<div style="font-size:9px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:#6b2fa0;margin-bottom:3px">${ssTypeLabel[ex.ssType]||"SUPERSET"}</div>`:"";
    const lBorder=ex.ssGroup?"border-left:3px solid #9b59b6;padding-left:10px":"";
    const bg=idx%2?"#F0EDE8":"#fff";
    return `<tr style="border-bottom:1px solid #ede9e5;background:${bg}">
      <td style="padding:9px 14px;font-size:12.5px;${lBorder}">${labelHTML}${esc(ex.name)}</td>
      <td style="padding:9px 8px;text-align:center;font-size:12.5px;font-weight:700">${esc(ex.sets)||"—"}</td>
      <td style="padding:9px 8px;text-align:center;font-size:12.5px;font-weight:700">${esc(ex.reps)||"—"}</td>
      <td style="padding:9px 8px;text-align:center;font-size:12.5px;font-weight:700;color:#BB080B">${esc(ex.weight)?esc(ex.weight)+" kg":"—"}</td>
      <td style="padding:9px 8px;text-align:center;font-size:12px">${esc(ex.rest)||"—"}</td>
      <td style="padding:9px 14px;font-size:11.5px;color:#888">${esc(ex.notes)||""}</td>
    </tr>`;}).join("");

  const bodyHTML=`${injuryHTML}
    <div style="margin:14px 24px 0">
      <div style="background:#111;color:#fff;padding:9px 16px;font-weight:800;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;display:flex;align-items:center;gap:10px;">
        <span style="display:inline-block;width:3px;height:16px;background:#BB080B;border-radius:2px;flex:none"></span>EXERCISES
      </div>
      <table style="width:100%;border-collapse:collapse">
        <thead><tr style="background:#F0EDE8">
          <th style="padding:8px 14px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#555;font-weight:700">Exercise</th>
          <th style="padding:8px 8px;text-align:center;font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#555;font-weight:700">Sets</th>
          <th style="padding:8px 8px;text-align:center;font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#555;font-weight:700">Reps</th>
          <th style="padding:8px 8px;text-align:center;font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#555;font-weight:700">Weight</th>
          <th style="padding:8px 8px;text-align:center;font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#555;font-weight:700">Rest</th>
          <th style="padding:8px 14px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#555;font-weight:700">Notes</th>
        </tr></thead>
        <tbody>${exRows}</tbody>
      </table>
    </div>`;

  mmPDFOpen(mmPDFShell(`${client} – Workout Plan`,"Custom Workout Plan",client,goal,date,bodyHTML,"Train within noted limits. Message your coach before making any changes."));
}

/* init */
checkSession();
sb.auth.onAuthStateChange((event)=>{ if(event==="SIGNED_OUT") resetAuthUI(); });
