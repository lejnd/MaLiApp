<script>
import moment from 'moment';
// 手机号验证规则
const isVerificationNumber = (number) => {
    var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    if (!myreg.test(number)) {
        return false;
    } else {
        return true;
    }
}

// form-data转换
const obj2formdata = (obj) => {
    let formData = new FormData();
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const element = obj[key];
            formData.append(key, element)
        }
    }
    return formData;
}

// is微信环境？
const isWeiXin = () => {
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true;
    } else {
        return false;
    }
}

// is移动端？
const isMobile = () => {
    if(/Mobile|Android|webOS|iPhone|iPad|Phone/i.test(navigator.userAgent)) {
        return true;
    } else {
        return false;
    }
}

// req common
const connectObj = (obj = {}) => {
    return Object.assign({}, obj, {
        tel: localStorage.getItem('tel'),
    })
}

// 日期时间格式化
const formatTime = (originTime) => {
    if (!originTime) return null;
    return moment(originTime).format('YYYY-MM-DD HH:mm:ss');
}

// 日期格式化
const formatDate = (originTime) => {
    if (!originTime) return null;
    return moment(originTime).format('YYYY/MM/DD');
}


//判断链接是否存在
const check_is_img = (url) => {
  return (url.match(/\.(jpeg|jpg|gif|png)$/) != null)
}

// 授权协议HTML模版
const authAgreement = () => {
    return `
        <p>闪电任务平台（以下简称“本网站”）依据《闪电任务平台注册协议》（以下简称“本协议”）相关规定提供服务，本协议具有合同效力。请您务必在注册之前认真阅读全部服务协议内容，如有任何疑问，可向本网站咨询。您承诺接受并遵守本协议的约定。如果您不同意本协议的约定，您应立即停止注册程序或停止使用闪电任务平台服务。</p>
        <p>若您已经注册为本网站会员，表明您已经阅读并同意本使用条款，您的会员活动会遵从本使用条款。</p>
        <h3>会员注册资格</h3>
        <p>您应当是具备完全民事权利能力和完全民事行为能力的自然人、法人或其他组织。若您不具备前述主体资格，则您及您的监护人应承担因此而导致的一切后果，且闪电任务平台有权注销（永久冻结）您的闪电任务平台账户，并向您及您的监护人索偿。</p>
        <h3>一、注册该网站后，您将具备以下权利和义务：</h3>
        <p>1、会员有权根据本协议及本网站发布的相关规则，利用本网站查看任务信息、查询行业信息、参加需求，在本网站发布信息，参加本网站的有关活动及有权享受本网站提供的其他有关资讯及信息服务。</p>
        <p>2、会员须自行负责自己的会员账号和密码，且须对在会员账号密码下发生的所有活动承担责任。因会员的过错导致的任何损失由会员自行承担。</p>
        <p>3、会员可通过会员名密码登陆闪电任务平台。您设置的会员名不得侵犯或涉嫌侵犯他人合法权益。除非有法律规定或司法裁定，且征得闪电任务平台的同意，否则，账户（会员名）和密码不得以任何方式转让、赠与或继承（与账户相关的财产权益除外）。</p>
        <p>4、会员有义务确保在本网站上发布的信息真实、准确，无误导性。</p>
        <p>5、会员在本网站网上发布任务，不得发布国家法律、法规、行政规章规定禁止的信息、侵犯他人知识产权或其他合法权益的信息、违背社会公共利益或公共道德的信息。会员在闪电任务平台的全部行为仅代表其个人或法人，不代表闪电任务平台，基于该行为的全部责任应当由用户自行承担。</p>
        <h3>二、闪电任务平台的权利和义务</h3>
        <p>1、本网站仅为会员提供一个威客任务聚合平台，对交易双方和威客网站均不加以监视或控制，亦不介入交易的过程。</p>
        <p>2、本网站有权对会员的注册资料进行审查，对存在任何问题或怀疑的注册资料，本网站有权发出通知询问会员并要求会员做出解释、改正。</p>
        <p>3、您了解并同意，闪电任务平台有权应政府部门（包括司法及行政部门）的要求，向其提供您在闪电任务平台填写的注册信息和交易纪录等必要信息。如您涉嫌侵犯他人知识产权，则闪电任务平台亦有权在初步判断涉嫌侵权行为存在的情况下，向权利人提供您必要的身份信息。除非法律法规或相关政府部门另有要求，闪电任务平台将在前述信息披露情 况发生后及时向您发出书面通知。</p>
        <p>4、本网站依据本协议及相关规则，可以冻结在本网站账户内的资金。被封号的会员如果账户中有资金，在扣除会员不正当收入后，会员可申请提现。</p>
        <h3>三、服务的中断和终止</h3>
        <p>1、本网站可自行全权决定以任何理由终止对会员的服务，并有权在两年内保存会员在本网站的全部资料。</p>
        <p>2、您了解闪电任务平台上的信息系用户自行发布，且可能存在风险和瑕疵。闪电任务平台仅为会员提供一个威客任务聚合平台。您应自行谨慎判断确定相关物品及/或信息的真实性、合法性和有效性，并自行承担相关风险。</p>
        <p>3、闪电任务平台上的任务价格、状态、是否结束等任务信息随时有可能发生变动，闪电任务平台不就此作出特别通知。您知悉并理解由于网站上任务信息数量极其庞大，虽然闪电任务平台会尽合理的最大努力保证您所浏览的任务信息的准确性，但由于众所周知的互联网技术因素等客观原因，闪电任务平台显示的信息可能存在一定的滞后性和差错。</p>
        <p>不论在何种情况下，闪电任务平台均不对由于罢工、暴乱、起义、骚乱、火灾、洪水、风暴、爆炸、战争、政府行为、司法行政机关的命令，以及其它非因闪电任务平台的原因而造成的不能服务或延迟服务承担责任。</p>
        <h3>四、隐私权政策</h3>
        <p>1、闪电任务平台开放注册，但16岁以下的用户使用闪电任务平台服务必须取得监护人的同意；</p>
        <p>2、一个帐号仅限一个自然人使用，会员必须向闪电任务平台提供真实确实的信息，对于由于资料提供不正确导致汇款无法收到等后果，闪电任务平台不承担责任。</p>
        <p>3、会员资料修改后必须及时通知闪电任务平台做出相应变更。</p>
        <p>4、闪电任务平台保证不向任何一家第三方机构透露会员的信息。</p>
        <p>5、会员必须遵守闪电任务平台（及合作伙伴）的使用条款及隐私政策。</p>
    `
}

export default {
    isVerificationNumber, obj2formdata, isWeiXin, isMobile, connectObj,formatTime, formatDate,authAgreement,check_is_img,
}
</script>
