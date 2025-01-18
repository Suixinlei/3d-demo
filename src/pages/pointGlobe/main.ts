import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass';
import Stats from 'stats.js';
import TWEEN from 'tween';
import * as dat from 'dat.gui';

import pointEarth from '../../scene/pointEarth/index';
import pointEarthBorder from '../../scene/pointEarthBorder';
import props from '../../scene/props';

import regionData from './region.json';

import {
  convertLngLat,
} from './utils';

let width = window.innerWidth;
let height = window.innerHeight;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

let renderRequested = false;

const scene = new THREE.Scene();
scene.background = new THREE.Color('#333');
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 2000 );
camera.position.z = 850;
scene.add(camera);

const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.autoClear = false;

// clock
const clock = new THREE.Clock();

// 鼠标
var mouse = new THREE.Vector2();

function onMouseMove( event ) {
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}
window.addEventListener('mousemove', onMouseMove, false );

// 环境光
const ambient = new THREE.AmbientLight( 0xffffff, 0.1 );
scene.add( ambient );
// 点状光源
const pointLight = new THREE.PointLight( 0xffffff, 5, 1000);
pointLight.position.set( 0, 0, 0 );
scene.add( pointLight );
var sphereSize = 5;
var pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
scene.add( pointLightHelper );

var controls = new OrbitControls( camera, renderer.domElement );
controls.addEventListener( 'change', render );
controls.minDistance = 500;
controls.maxDistance = 1000;
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.rotateSpeed = 0.1;
controls.enablePan = false;
controls.update();

// stats
const stats = new Stats();
document.body.appendChild( stats.dom );

// axisHelper
var axesHelper = new THREE.AxesHelper( 1000 );
scene.add( axesHelper );

const settings = {
  isSelfRotate: false,
  maxVisibleDot: 1,
};

const postprocessing = {};

const gui = new dat.GUI({width: 300});
gui.add(settings, 'maxVisibleDot', -1, 1, 0.01).onChange(requestRenderIfNotRequested);
gui.add(settings, 'isSelfRotate').onChange(requestRenderIfNotRequested);

var effectController = {
  focus: 210.0,
  aperture:	10,
  maxblur:	1.0
};

var matChanger = function ( ) {
  postprocessing.bokeh.uniforms[ "focus" ].value = effectController.focus;
  postprocessing.bokeh.uniforms[ "aperture" ].value = effectController.aperture * 0.00001;
  postprocessing.bokeh.uniforms[ "maxblur" ].value = effectController.maxblur;
};

const dof = gui.addFolder('dof');
dof.add( effectController, "focus", 10.0, 3000.0, 10 ).onChange( matChanger );
dof.add( effectController, "aperture", 0, 10, 0.1 ).onChange( matChanger );
dof.add( effectController, "maxblur", 0.0, 3.0, 0.025 ).onChange( matChanger );
dof.open();

pointEarth.Init(scene);
pointEarthBorder.Init(scene);

initPostprocessing();
matChanger();

// 画出路径点
const pathPoints = [[406.9845861278568,387.5661835794464,-4.9841237070379005e-14],[406.9770176346209,387.5689956466114,-1.9951768609254616],[406.9532111692774,387.5771728314162,-4.125411375862478],[406.9114702068121,387.59032647938494,-6.387036381174562],[406.8500476529964,387.60806780056294,-8.77636033152674],[406.7671574648239,387.63000791295826,-11.289666664123747],[406.66098597271076,387.655757882454,-13.923213288712121],[406.5297029001534,387.68492875919674,-16.673232226823703],[406.37147207624497,387.7171316104625,-19.5359294209658],[406.18446183613963,387.7519775500016,-22.50748473172079],[405.96685510426465,387.78907776386416,-25.584052138093437],[405.71685915481453,387.82804353270535,-28.761760153831005],[405.43271504382676,387.86848625057036,-32.03671246995098],[405.11270670695455,387.9100174401571,-35.404988831265676],[404.7551697169087,387.9522487645551,-38.86264615232923],[404.35849969447054,387.99479203545934,-42.40571987595046],[403.9211603669591,388.0372592178542,-46.03022557521425],[403.4416912680924,388.079262431169,-49.73216079782816],[402.918715073309,388.120413946897,-53.50750714958632],[402.35094456481465,388.160326182681,-57.35223261178361],[401.73718922090063,388.1986116928584,-61.26229408557702],[401.0763614244211,388.23488315546535,-65.23364015451915],[400.3674822857558,388.26875335569895,-69.26221405482525],[399.6096870760704,388.29983516583343,-73.34395684138974],[398.8022302672691,388.32774152159124,-77.47481073608604],[397.94449017566126,388.3520853949675,-81.65072264354379],[397.03597320707365,388.3724797635093,-85.86764781834026],[396.0763177018933,388.3885375760487,-90.12155366640731],[395.06529737934613,388.39987171489423,-94.40842366241732],[394.00282438117506,388.4060949544808,-98.72426136400188],[392.8889519157859,388.40681991648506,-103.0650945028355],[391.7238765048727,388.40165902140876,-107.42697913193211],[390.5079398354948,388.39022443663924,-111.80600380791104],[389.2416302215731,388.37212802099265,-116.19829378651771],[387.9255836797691,388.346981265751,-120.60001520932282],[386.5605846257186,388.3143952322038,-125.00737925926805],[385.14756619759606,388.2739804857062,-129.41664626258043],[383.68761021497625,388.22534702626933,-133.82412971453675],[382.1819467819373,388.16810421569954,-138.22620020661145],[380.63195354429047,388.1018607013027,-142.61928923271117],[379.0391546117414,388.0262243361779,-146.99989285243205],[377.4052191566516,387.94080209611985,-151.364575189636],[375.73195970189175,387.84519999315745,-155.70997174504834],[374.0213301110391,387.7390229857557,-160.03279250210164],[372.27542329487386,387.6218748857098,-164.32982480581452],[370.49438970667904,387.492503509032,-168.6044688618253],[368.66883284622617,387.3468409543987,-172.8864265650984],[366.79576664301806,387.185062245843,-177.17955058765503],[364.87338510855614,387.00792695771037,-181.48354556630977],[362.89986948378566,386.8161942719587,-185.79805321264715],[360.87338979868053,386.6106232504881,-190.12265126775083],[358.79210646583937,386.3919730929061,-194.45685245621164],[356.6541719102733,386.1610033796748,-198.80010344011401],[354.457732237586,385.9184743006074,-203.1517837738059],[352.20092894277104,385.66514686868805,-207.5112048603699],[349.88190066187053,385.4017831192069,-211.877608910835],[347.4987849687633,385.129146294209,-216.25016790728068],[345.0497202193644,384.84800101226926,-220.62798257111154],[342.53284744553946,384.55911342361713,-225.01008133790896],[339.94631230105375,384.26325135063723,-229.39541934038573],[337.2882670618878,383.9611844137909,-233.78287740112117],[334.5568726832682,383.6536841430007,-238.1712610368727],[331.75030091577315,383.34152407455645,-242.55929947641724],[328.86673648287365,383.0254798335989,-246.9456446940206],[325.90437932228855,382.7063292022506,-251.328870460782],[322.86144689352545,382.384852173462,-255.707471416263],[319.7361765539829,382.0618309906485,-260.07986216297763],[316.5268280059843,381.738050173196,-264.44437638648424],[313.2316858171044,381.4142965279134,-268.79926600400483],[309.8490620161382,381.0913591465158,-273.1427003446746],[306.37729876703924,380.7700293892198,-277.4727653647202],[302.8147711231379,380.45110085453217,-281.78746290105994],[299.15988986390806,380.1353693353147,-286.0847099670277],[295.41110441652523,379.8236327612043,-290.36233809413153],[291.566905864404,379.5166911274665,-294.61809272398216],[287.6258300448569,379.21534641035464,-298.84963265475477],[283.58646073794597,378.92040246904656,-303.0545295467818],[279.44743294853487,378.6326649342224,-307.23026749212545],[275.2074362834566,378.3529410833437,-311.3742426532275],[270.8652184256233,378.0820397026849,-315.48376297599975],[266.41958870679616,377.82077093616397,-319.5560479829858],[261.8694217806062,377.5699461210073,-323.5882286525124],[257.21366139728684,377.3303776102772,-327.5773473900287],[252.45132428142608,377.10287858227946,-331.52035809813077],[247.5815041138722,376.888262836857,-335.4141263520797],[242.6033756187443,376.6873445785655,-339.2554296879263],[237.51619875628953,376.50093818671183,-343.0409580106851],[232.3193230221008,376.32985797222585,-346.76731413032155],[227.0121918529585,376.17491792131887,-350.43101443366095],[221.5947597720007,376.0370401312627,-354.02811596101856],[216.10671063793495,375.9270100424915,-357.52031094437757],[210.57411040985536,375.8501814323541,-360.88666523212595],[204.99635932968445,375.8045770204874,-364.13103761149983],[199.37257865672976,375.7882121620483,-367.2571231165129],[193.7016244022127,375.7990961493867,-370.26844321012317],[187.98210050280437,375.83523342535653,-373.16833628626824],[182.2123714523351,375.89462470925264,-375.9599484046225],[176.39057441597137,375.97526803618376,-378.6462241754478],[170.51463085605494,376.0751597105362,-381.22989771621803],[164.5822577035384,376.1922951740281,-383.71348360580583],[158.59097811354837,376.3246697887262,-386.099267765939],[152.53813184817668,376.4702795352659,-388.38929820337097],[146.42088533413704,376.62712162641105,-390.58537554979205],[140.236241447499,376.79319503598873,-392.6890433399563],[133.9810490823727,376.9665009431518,-394.70157797184396],[127.6520125652018,377.145043091846,-396.6239782959462],[121.2457009812608,377.3268280653066,-398.45695478399824],[114.7585574850963,377.5098654753543,-400.2009182307304],[108.18690867203111,377.6921680662341,-401.8559679455031],[101.52697409348679,377.87175173271515,-403.4218793941025],[94.7748760048147,378.0466354521652,-404.89809125453996],[87.92664944057617,378.21484113031454,-406.2836918545032],[80.97825271880718,378.3743933604456,-407.5774049622033],[73.92557848274282,378.52331909576867,-408.777574906837],[66.7644653958023,378.65964723479425,-409.88215100981637],[59.49071061332758,378.78140811955836,-410.88867131339344],[52.10008316263419,378.88663294663365,-411.7942455994371],[44.58833837139006,378.9733530909316,-412.59553769799123],[36.951233493133756,379.03959934239776,-413.28874709298645],[29.18454468788883,379.08340105580555,-413.86958984120093],[21.28408552526725,379.1027852139717,-414.3332788304149],[13.245727187161917,379.0957754048451,-414.67450341380106],[5.065420557012858,379.06039071306753,-414.8874084701019],[-3.260779607356904,378.9946445267557,-414.9655729532154],[-11.736688210293652,378.8965432604256,-414.90198801060814],[-20.36596084728333,378.7640849951637,-414.68903476767184],[-29.152062099651936,378.59525803734044,-414.3184618949266],[-38.09823085899374,378.38803939737727,-413.78136309701495],[-47.20744243661375,378.1403931902976,-413.06815468694873],[-56.482367205368114,377.85026896003137,-412.16855343622456],[-65.92532551448724,377.5155999296999,-411.07155492143664],[-75.53823861254523,377.13430118037104,-409.76541262105985],[-85.32257531008679,376.70426776106586,-408.23761805234676],[-95.27929411188639,376.2233727330957,-406.47488227795185],[-105.44170206216648,375.700009232771,-404.4447434801559],[-115.90384735380786,375.16671767236795,-402.0699343640693],[-126.64587022702682,374.6248948363981,-399.32569629721644],[-137.63811068706192,374.07331340778,-396.19301695337964],[-148.84990837021743,373.51074002998826,-392.65434145114],[-160.24968534903874,372.9359350839016,-388.69374405646147],[-171.8050454594528,372.34765243651896,-384.29708830498396],[-183.4828894821726,371.7446391619628,-379.4521742217521],[-195.24954528883194,371.12563523522095,-374.1488713543824],[-207.07091185194258,370.4893731991057,-368.37923640093885],[-218.91261581959603,369.8345778049509,-362.13761430546765],[-230.74017917367553,369.15996562759756,-355.4207218111109],[-242.51919632687958,368.46424465526866,-348.22771260137637],[-254.2155188716376,367.746113854973,-340.56022332237995],[-265.7954460752879,367.0042627141278,-332.4223999601986],[-277.22591912266586,366.237370759142,-323.8209042449606],[-288.4747170411624,365.4441070517586,-314.76489996370947],[-299.51065220551556,364.6231296640092,-305.2660192839189],[-310.30376331085023,363.77308513270026,-295.338309415086],[-320.8255037230333,362.89260789441596,-284.99816016327486],[-331.0489231649717,361.9803197020912,-274.2642131589255],[-340.9488407752943,361.034829024284,-263.1572537578798],[-350.50200768061194,360.0547304283531,-251.7000868256233],[-359.6872573524564,359.03860394883117,-239.91739781170975],[-368.4856421727999,357.9850144423677,-227.83560070190327],[-376.8805548050804,356.89251093070874,-215.48267459679613],[-384.8578331578297,355.7596259332761,-202.88799080496528],[-392.4058479319587,354.58487479100705,-190.082132453964],[-399.5155719568777,353.36675498322325,-177.0967087119228],[-406.1806307410803,352.10374543940355,-163.96416577509237],[-412.39733388573154,350.7943058478573,-150.71759681158827],[-418.1646872311691,349.43687596340527,-137.39055305876838],[-423.4843858221924,348.02987491631063,-124.01685825135921],[-428.36078798474057,346.57170052482644,-110.63042851052411],[-432.800871000459,345.0607286138681,-97.26509975171246],[-436.8141690433295,343.4953123424576,-83.95446457302351],[-440.41269420091965,341.8737815427384,-70.7317204679434],[-443.61084153914584,340.19444207351313,-57.62953106890589],[-446.42527928139015,338.4555751914177,-44.67990197369982],[-448.8748252583984,336.65543694301283,-31.914072537854373],[-450.9803108431016,334.79225758124807,-19.362424835508904],[-452.76443361324453,332.8642410099372,-7.054410801507],[-454.25159998383776,330.8695642600646,4.981501628878824],[-455.4677590207325,328.80637700194563,16.71786276670518],[-456.44179250797384,326.6702645725726,28.132335420174115],[-457.23917937680704,324.3923315923426,39.31854583918035],[-457.88737845128605,321.9472876646271,50.32983827113538],[-458.3914708505754,319.3418063827671,61.17246233099837],[-458.75559501706783,316.582613162157,71.8523004778285],[-458.98304093281587,313.6765052047108,82.37486399760643],[-459.0763373362939,310.6303697401796,92.74529579969312],[-459.0373320870887,307.45120052017097,102.96837887950565],[-458.8672658800433,304.1461125521199,113.04854940779644],[-458.56683955076215,300.7223550714414,122.98991350802508],[-458.13627524324323,297.1873227606364,132.79626687754737],[-457.57537172952124,293.54856523425116,142.47111649560077],[-456.88355418225456,289.8137948182803,152.01770374143496],[-456.0599187055594,285.9908926618257,161.43902831958147],[-455.1032719284319,282.0879132275842,170.73787245641392],[-454.0121659598867,278.11308721596885,179.91682489310213],[-452.7849289965279,274.0748229853494,188.97830425516756],[-451.4196918624946,269.9817065380049,197.92458142837427],[-449.9144107493853,265.84250014783373,206.75780061507365],[-448.2668864105123,261.66613971165634,215.47999878463153],[-446.47478005026863,257.46173091100843,224.09312326658247],[-444.5356261359967,253.23854427561042,232.5990472659918],[-442.44684234697957,249.00600924318897,240.99958310745663],[-440.20573686339935,244.77370731294343,249.2964930375658],[-437.809513187669,240.55136439168632,257.491497435691],[-435.25527268171203,236.34884243248771,265.58628030000267],[-432.5400149967956,232.1761304654791,273.5824918898295],[-429.6606365676486,228.04333511931983,281.48174841708783],[-426.61392733998025,223.96067072963893,289.2856286888245],[-423.3965659003761,219.93844912754327,296.9956676100504],[-420.005113179992,215.9870691969965,304.61334646130325],[-416.4360049086973,212.11700628451763,312.14007986892267],[-412.68554300442906,208.33880153821417,319.5771993881293],[-408.7498860936697,204.6630512456449,326.9259336198868],[-404.62503937326886,201.1003962314036,334.1873847824796],[-400.3068440414359,197.6615113656486,341.36250165803676],[-395.7909665467397,194.35709522403306,348.4520488332272],[-391.07288792852506,191.19785992770923,355.4565721523621],[-386.14789355036515,188.1945211792021,362.37636030065033],[-381.01106356020017,185.3577884960894,369.2114024357375],[-375.65726444669514,182.69835562951423,375.96134178755307],[-370.0811421012667,180.22689113869652,382.6254251503714],[-364.2771168391866,177.95402907575323,389.20244819763866],[-358.23938088126533,175.89035971735586,395.6906965602134],[-351.9618988498444,174.04642026106148,402.08788262309264],[-345.4680545063801,172.40307400983224,408.37850505081326],[-338.8242449876449,170.89785758674753,414.53112462252113],[-332.03939001359396,169.5255234967216,420.5412469218245],[-325.12009551752374,168.283082677311,426.40559045971435],[-318.07296740434975,167.1675007361603,432.12106417555873],[-310.90461251404633,166.17570174018846,437.68477020413525],[-303.62163911497396,165.3045717290688,443.09400675997165],[-296.2306569162681,164.55096197457252,448.3462711077222],[-288.73827659191505,163.91169200617333,453.4392625858552],[-281.15110881261575,163.38355242214018,458.3708856497743],[-273.4757627850416,162.96330750419247,463.1392528996367],[-265.71884430150624,162.6476976526515,467.7426880576153],[-257.88695330652854,162.43344165789776,472.1797288590931],[-249.98668099009706,162.31723882284797,476.44912982235786],[-242.02460642073598,162.2957709500765,480.5498648617105],[-234.00729273467368,162.36570420616317,484.48112970953326],[-225.94128290047192,162.52369087481097,488.24234411377904],[-217.8330950814494,162.76637100928437,491.83315377849857],[-209.68921762101243,163.09037399374216,495.2534320164465],[-201.51610367867445,163.49232002210164,498.5032810844442],[-193.32016554699206,163.96882150216086,501.5830331740461],[-185.1077686819331,164.51648439182705,504.4932510321121],[-176.88522548126838,165.1319094734586,507.23472818813417],[-168.65878884742756,165.81169357151435,509.8084887675617],[-160.4346455729036,166.55243071793328,512.2157868729203],[-152.21890958768608,167.35071326892455,514.4581055171724],[-144.01761510936984,168.20313297614408,516.5371550965323],[-135.83670973749236,169.10628201456504,518.4548713927786],[-127.68204753432313,170.05675396872138,520.2134130979945],[-119.55938213475532,171.05114477840152,521.8151588575728],[-111.47435992809191,172.08605364431733,523.2627038302533],[-103.43251335444988,173.15808389375005,524.5588557668498],[-95.43925435817468,174.26384380568814,525.7066306121907],[-87.4998680400802,175.39994739453252,526.7092476375973],[-79.61950654952585,176.5630151510279,527.5701241139303],[-71.80318325632362,177.74967473871234,528.2928695378547],[-64.0557672412029,178.95656164384326,528.8812794264458],[-56.381978142133896,180.18031977645853,529.3393286976068],[-48.78638139216248,181.41760201997448,529.6711646559407],[-41.27338388258153,182.66507072650109,529.8810996057166],[-33.84723008331487,183.9193981548676,529.9736031143801],[-26.511998650226275,185.17726684820607,529.953293951645],[-19.271599546851988,186.435369947828,529.824931730588],[-12.129771705647657,187.6904114400544,529.5934082783054],[-5.090867576291612,188.94327269997873,529.2622438534061],[1.8328483835499358,190.24523386780064,528.8169736850253],[8.639217285373519,191.6109129813625,528.25620862527],[15.329700572235193,193.03835636428525,527.5842996645567],[21.905885127062458,194.52560627008563,526.8053916789914],[28.36947272641109,196.0707014753854,525.9234288755121],[34.7222701274941,197.6716778737351,524.9421603603349],[40.96617975677578,199.32656907129066,523.8651457946057],[47.1031909689526,201.03340698538133,522.6957611042894],[53.13537184584976,202.79022244682,521.4372042142492],[59.06486150550981,204.595045806616,520.092500779163],[64.89386289261948,206.44590754757436,518.6645098864317],[70.62463602233154,208.34083890109332,517.1559297085377],[76.25949165050068,210.27787246929896,515.5693030844569],[81.80078534434755,212.25504285250028,513.9070230116838],[87.25091192859945,214.2703872817898,512.1713380322444],[92.61230028317384,216.3219462564669,510.36435749773267],[97.88740846953064,218.40776418582232,508.4880566999283],[103.078719163835,220.5258900346795,506.5442818549587],[108.18873537610058,222.67437797196666,504.5347549302405],[113.21997643550132,224.85128802147076,502.4610783046087],[118.17497422298264,227.05468671379953,500.3247392531132],[123.05626963329672,229.28264773848446,498.12711424893087],[127.86640924945988,231.53325259503907,495.8694730757395],[132.60794221353308,233.80459124170605,493.55298274470096],[137.28341727844253,236.09476274052474,491.1787112109486],[141.8953800263561,238.40187589727952,488.74763088513697],[146.4463702398606,240.72404989480896,486.26062193623216],[150.93891941288265,243.0594149180862,483.7184753822713],[155.3755483889265,245.40611276942454,481.1218959663351],[159.75876511478373,247.7622974721018,478.47150481543315],[164.0910624983949,250.12613586065345,475.7678418804341],[168.3749163600181,252.49580815603787,473.0113681555511],[172.61278346625468,254.86950852384825,470.2024676762596],[176.80709963684745,257.24544561371243,467.3414492948474],[180.96027791444345,259.6218430780013,464.4285482331045],[185.07470678774865,261.9969400679505,461.4639274119482],[189.15274845866819,264.3689917052939,458.44767855804224],[193.19673714412673,266.7362695275,455.3798230877342],[197.2089774033055,269.09706190470445,452.2603127688724],[201.1917424810185,271.44967442644895,449.08903016131046],[205.14727265785947,273.79243025634014,445.86578883714435],[209.0777735976073,276.12367045277216,442.59033338196235],[212.98541468217257,278.44175425387596,439.2623391786363],[216.8723273240902,280.745059324894,435.88141197543007],[220.69078308947118,283.0695652357371,432.44791535699045],[224.36888105425737,285.4682478916102,428.9644328614609],[227.91052220050517,287.936100106522,425.43342149593747],[231.32042889743323,290.4675439363974,421.8571619568224],[234.60335773472372,293.05703107170694,418.2377805495696],[237.76409666877282,295.69904759271367,414.57726371334513],[240.8074626640667,298.3881186249217,410.87747150309156],[243.7382997604686,301.1188128834865,407.140150019027],[246.56147750441832,303.8857470936309,403.36694277566176],[249.2818896887297,306.68359027254184,399.5594010041057],[251.90445335179507,309.5070678568564,395.71899288280895],[254.43410799255852,312.35096565864217,391.84711169299794],[256.8758149625809,315.210133631751,387.9450828959733],[259.23455700093416,318.0794894295716,384.0141701301561],[261.5153378814606,320.95402173452965,380.05558012635015],[263.7231821451571,323.8287933391606,376.07046654016256],[265.8631348930957,326.6989439582368,372.0599327008869],[267.94026161732387,329.55969275123465,368.0250332764768],[269.9596480486624,332.406340534393,363.9667748544851],[271.92640000117296,335.23427166172644,359.8861154390843],[273.84564319335567,338.0389555546155,355.78396286449185],[275.7225230258189,340.8159478599967,351.66117212534107],[277.5622042942541,343.56089121770367,347.51854162477724],[279.3698708150647,346.26951561816634,343.35680834131495],[281.1507249389014,348.93763833246345,339.1766419158211],[282.90998692469014,351.56116339760325,334.97863766036687],[284.65289414347046,354.1360806409204,330.76330849118335],[286.3847000775281,356.65846422857373,326.53107578853735],[288.1106730758549,359.12447072432167,322.28225918711956],[289.8360948219847,361.5303366460538,318.01706530142764],[291.566258464649,363.8723755089034,313.73557539181485],[293.3064663555601,366.1469743452371,309.43773197824953],[295.0620273319056,368.3505896933173,305.1233244105917],[296.83825347388535,370.4797430480343,300.7919734062662],[298.64045625981447,372.53101576875224,296.4431145687677],[300.4739420330019,374.5010434410314,292.0759809034748],[302.3440066857947,376.38650969076195,287.6895843508872],[304.2559294568796,378.1841394510849,283.282696361731],[306.21496572820604,379.89069168436316,278.8538275434815],[308.2263386977561,381.50295156342827,274.401206413836],[310.29522979389407,383.0177221183407,269.92275730369977],[312.42676768624483,384.43181535699114,265.4160774603783],[314.62601573704575,385.74204287002743,260.878413411095],[316.8979577257534,386.9452059328281,256.3066366578282],[319.2543422811615,388.03932822634107,251.68660012855855],[321.7447210552533,389.03308643193884,246.936413139733],[324.36523441725967,389.9319997676418,242.04179444600896],[327.10044268433273,390.7399328505176,237.00549629003666],[329.93512709026817,391.4606691311048,231.8304476020273],[332.85431349553454,392.09791703686165,226.5198213021783],[335.84329765030293,392.6553159992602,221.07709569489813],[338.8876720680051,393.13644234516175,215.50610993778707],[341.973354490078,393.544815034898,209.8111135711151],[345.0866178512224,393.8839012311714,203.99681009985716],[348.2141215888259,394.15712168445964,198.0683946306037],[351.34294408040915,394.3678559220921,192.03158557987936],[354.4606159391693,394.51944722955454,185.8926504886934],[357.55515385018856,394.61520741387056,179.6584260002183],[360.61509458874747,394.65842134013224,173.3363320832171],[363.62952882765586,394.6523512333829,166.93438061268154],[366.58813431267174,394.60024073911785,160.46117845069193],[369.4812079639941,394.5053187366602,153.92592520415113],[372.2996964475263,394.3708029005849,147.33840587106903],[375.0352247520218,394.1999030062222,140.70897862284951],[377.6801223072649,393.9958239760563,134.04855800566412],[380.22744618384576,393.7617686645641,127.36859387880949],[382.67100092662616,393.5009403797039,120.68104644103332],[385.0053545912664,393.21654513986624,113.9983577264197],[387.2258505757417,392.9117936656477,107.3334199787598],[389.32861486614445,392.5899031062919,100.69954133660056],[391.31055834759735,392.25409850107536,94.11040927974068],[393.16937386622993,391.90761397628,87.58005230105653],[394.9035277661321,391.5536936787116,81.12280027477736],[396.5122456653562,391.19559244697433,74.75324399299986],[397.99549227660316,390.83657622190657,68.48619433610088],[399.3539451204969,390.47992219772334,62.33664152932107],[400.58896202162794,390.12891871547936,56.31971491694263],[401.70254231910036,389.7868649004932,50.450643657103456],[402.6972817636086,389.4570700453209,44.744718704165024],[403.5763211114646,389.142852739768,39.21725640188681],[404.34328846211525,388.84753974925945,33.88356395940098],[405.0022354191219,388.57446464266206,28.758907023437786],[405.5575671851426,388.32696617036027,23.85847949456172],[406.0139667290493,388.10838639303597,19.197375662741145],[406.37631318801897,387.92206856118867,14.790564658646787],[406.64959468949377,387.7713547449521,10.652867132138066],[406.83881579772896,387.6595832132274,6.798933978826663],[406.94889980786354,387.5900855605499,3.243226839895723],[406.9845861278568,387.5661835794464,4.9841237070379005e-14]];
const curve = new THREE.CatmullRomCurve3(pathPoints.map(p => {
  return new THREE.Vector3(...p);
}), true);

const sphere = new THREE.Mesh(new THREE.SphereGeometry(props.globeRadius, 64, 64), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.2 }));
scene.add(sphere);


let countryInfos;
function loadCountryData() {
  countryInfos = regionData;

  const labelParentElem = document.querySelector('#labels');
  for (const countryInfo of countryInfos) {
    const {lat, lng, LocalName} = countryInfo;

    const position = convertLngLat(lat, lng);
    countryInfo.position = position;

    // add an element for each country
    const elem = document.createElement('div');
    elem.textContent = LocalName;
    labelParentElem.appendChild(elem);
    countryInfo.elem = elem;
  }
  requestRenderIfNotRequested();
}
loadCountryData();

const tempV = new THREE.Vector3();
const cameraToPoint = new THREE.Vector3();
const cameraPosition = new THREE.Vector3();
const normalMatrix = new THREE.Matrix3();

function updateLabels() {
  if (!countryInfos) {
    return;
  }

  // get a matrix that represents a relative orientation of the camera
  normalMatrix.getNormalMatrix(camera.matrixWorldInverse);
  // get the camera's position
  camera.getWorldPosition(cameraPosition);
  for (const countryInfo of countryInfos) {
    const { position, elem } = countryInfo;

    // Orient the position based on the camera's orientation.
    // Since the sphere is at the origin and the sphere is a unit sphere
    // this gives us a camera relative direction vector for the position.
    tempV.copy(position);
    tempV.applyMatrix3(normalMatrix);

    // 计算从点到计算机的单位向量（方向）
    cameraToPoint.copy(position);
    cameraToPoint.applyMatrix4(camera.matrixWorldInverse).normalize();

    // get the dot product of camera relative direction to this position
    // on the globe with the direction from the camera to that point.
    // -1 = facing directly towards the camera
    // 0 = exactly on tangent of the sphere from the camera
    // > 0 = facing away
    const dot = tempV.dot(cameraToPoint);

    // if the orientation is not facing us hide it.
    if (dot > settings.maxVisibleDot) {
      elem.style.display = 'none';
      continue;
    }

    // restore the element to its default display style
    elem.style.display = '';

    // get the normalized screen coordinate of that position
    // x and y will be in the -1 to +1 range with x = -1 being
    // on the left and y = -1 being on the bottom
    tempV.copy(position);
    tempV.project(camera);

    // convert the normalized position to CSS coordinates
    const x = (tempV.x *  .5 + .5) * canvas.clientWidth;
    const y = (tempV.y * -.5 + .5) * canvas.clientHeight;

    // move the elem to that position
    elem.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;

    // set the zIndex for sorting
    elem.style.zIndex = (-tempV.z * .5 + .5) * 100000 | 0;
  }
}

function initPostprocessing() {

  var renderPass = new RenderPass( scene, camera );

  var bokehPass = new BokehPass( scene, camera, {
    focus: 1.0,
    aperture:	0.025,
    maxblur:	1.0,

    width: width,
    height: height
  } );

  var composer = new EffectComposer( renderer );

  composer.addPass( renderPass );
  composer.addPass( bokehPass );

  postprocessing.composer = composer;
  postprocessing.bokeh = bokehPass;
}


function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}


function render() {
  renderRequested = undefined;

  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  // Line.render();

  const delta = clock.getDelta();
  pointEarth.update(delta);

  if (settings.isSelfRotate) {
    var time = Date.now();
    var looptime = 60 * 1000;
    var t = (time % looptime) / looptime;
    var pos = curve.getPointAt(t).setLength(props.initCameraDistance);
    camera.lookAt(pos.setLength(props.globeRadius + 20));
    // camera.lookAt(new THREE.Vector3(0, 0, 0));
    camera.position.copy( pos );
  }

  updateLabels();

  postprocessing.composer.render(delta);
}

const animate = () => {
  requestAnimationFrame( animate );

  TWEEN.update();
  stats.update();

  render();
};

function requestRenderIfNotRequested() {
  if (!renderRequested) {
    renderRequested = true;
    requestAnimationFrame(render);
  }

  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  width = window.innerWidth;
  height = window.innerHeight;

  postprocessing.composer.setSize( width, height );
}

controls.addEventListener('change', requestRenderIfNotRequested);
window.addEventListener('resize', requestRenderIfNotRequested);

render();
animate();