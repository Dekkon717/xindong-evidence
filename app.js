const COLD_WORDS = new Set(['嗯', '哦', '好', '行', '哦哦', '嗯嗯', '好的', 'ok', 'OK', '好吧', '随便', '可以', '知道了', '知道', '哈', '哈哈', 'em', 'em...', 'emmm']);
const GOODNIGHT_WORDS = ['晚安', 'good night', 'goodnight', '晚安啦', '晚安哦'];
const POSITIVE_WORDS = ['开心', '高兴', '快乐', '幸福', '爱', '喜欢', '想你', '好想', '哈哈', '嘻嘻', '棒', '可爱', '帅', '甜', '暖', '温柔', '期待', '谢谢', '宝贝', '宝宝'];
const NEGATIVE_WORDS = ['烦', '累', '难过', '伤心', '痛苦', '委屈', '生气', '愤怒', '失望', '绝望', '算了', '无所谓', '随便', '不想', '放弃', '心累', '难受', '哭', '不合适', '不理'];
const HEDGING_WORDS = ['也许', '可能', '感觉', '好像', '大概', '应该', '似乎', '觉得', '不确定'];
const PASSION_WORDS = ['想你', '好想', '想见', '见面', '喜欢', '爱你', '宝宝', '亲爱', '拥抱', '抱抱', '心动'];
const INTIMACY_WORDS = ['难过', '害怕', '压力', '家里', '过去', '委屈', '不确定', '理解', '辛苦', '在的', '陪你', '我也是', '谢谢你'];
const FUTURE_WORDS = ['以后', '将来', '等以后', '下次', '周末', '下周', '明天', '改天', '有空一起'];
const CONCRETE_FUTURE_WORDS = ['明天', '周末', '下周', '周六', '周日', '几点', '点见', '地址', '地点', '来接', '一起去'];
const REVOKE_TYPES = new Set(['revoke', '撤回', '撤回消息']);

const sampleMessages = [
  ['2026-06-10 20:14', 'me', '今天见到你很开心，回家了吗？'], ['2026-06-10 20:29', 'them', '到了。你今天也辛苦啦'],
  ['2026-06-11 09:02', 'them', '早呀，今天下班要不要一起吃饭'], ['2026-06-11 09:10', 'me', '好呀，我来选地方'],
  ['2026-06-13 22:42', 'me', '晚安，今天和你聊天很舒服'], ['2026-06-13 22:50', 'them', '晚安哦，做个好梦'],
  ['2026-06-17 18:20', 'me', '你这周是不是有点忙？感觉最近回得比较慢'], ['2026-06-17 21:44', 'them', '对不起，最近事情有点多，不是不想理你'],
  ['2026-06-18 08:19', 'them', '早安。周六我空出来了，我们去看这个展？'], ['2026-06-18 08:26', 'me', '好！我已经期待很久了'],
  ['2026-06-22 23:11', 'me', '你睡了吗？今天突然有点想你'], ['2026-06-22 23:28', 'them', '还没睡。我也想你，今天发生什么啦'],
  ['2026-06-27 16:10', 'them', '下雨了，出门记得带伞'], ['2026-06-27 16:13', 'me', '收到，你也别淋到'],
  ['2026-07-02 20:03', 'me', '我是不是总在问你什么时候有空'], ['2026-07-02 20:06', 'me', '你不用有压力，我只是想见你'], ['2026-07-02 20:19', 'me', '如果这周不方便，那下周也可以'],
  ['2026-07-03 10:16', 'them', '不是的，我昨天只是加班。周日见，我来接你'], ['2026-07-03 10:22', 'me', '好吧，那我等你'],
  ['2026-07-09 12:12', 'them', '午饭吃了吗'], ['2026-07-09 12:31', 'me', '刚吃，你呢'], ['2026-07-09 12:42', 'them', '吃过了，下午加油'],
  ['2026-07-16 00:02', 'me', '晚安'], ['2026-07-16 00:46', 'them', '晚安，今天有点累'],
  ['2026-07-19 19:30', 'them', '下周有个朋友聚会，你愿意和我一起去吗'], ['2026-07-19 19:52', 'me', '愿意呀，听起来很开心'],
  ['2026-07-28 21:04', 'me', '你最近好像又忙起来了'], ['2026-07-28 21:07', 'me', '没事，你忙完再回'], ['2026-07-28 22:12', 'them', '我在的，只是最近真的有点乱。谢谢你理解我'],
  ['2026-08-03 09:05', 'them', '早上好，昨天睡得好吗'], ['2026-08-03 09:19', 'me', '睡得不错，看到你的消息更开心了'],
  ['2026-08-09 14:22', 'me', '周末要不要去海边？'], ['2026-08-09 14:25', 'them', '可以呀，我查一下天气'],
  ['2026-08-15 23:50', 'me', '我有时候会不确定你是怎么想的'], ['2026-08-16 00:11', 'them', '我喜欢和你在一起，这件事是真的'],
  ['2026-08-22 18:10', 'them', '今天路过你说的那家店，给你拍了照片'], ['2026-08-22 18:14', 'me', '好可爱！下次一起去'],
  ['2026-08-31 20:20', 'me', '这个周末见吗？'], ['2026-08-31 20:44', 'them', '见。我周六下午去找你'],
];

let currentMessages = [];
let currentContact = 'TA';
let latestAnalysis = null;
let lastImportInfo = { unknown: 0, total: 0 };
let currentSourceLabel = '示例样本';
let pendingImport = null;
const TRANSIENT_IDENTITY_SOURCES = new Set(['detected']);
let importRevision = 0;

const $ = (id) => document.getElementById(id);
const escapeHtml = (value) => String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
const dateText = (timestamp, withTime = false) => { const date = new Date(timestamp * 1000); const pad = (value) => String(value).padStart(2, '0'); return withTime ? `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}` : `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())}`; };
const humanDuration = (seconds, fallback = '暂无样本') => { if (seconds == null || !Number.isFinite(seconds)) return fallback; if (seconds < 1) return '< 1 秒'; if (seconds < 60) return `${Math.round(seconds)} 秒`; if (seconds < 3600) return `${(seconds / 60).toFixed(seconds < 600 ? 1 : 0)} 分钟`; return `${(seconds / 3600).toFixed(1)} 小时`; };
const compactDuration = (seconds) => { if (seconds == null || !Number.isFinite(seconds)) return '—'; if (seconds < 60) return `${Math.round(seconds)}秒`; if (seconds < 3600) return `${Math.round(seconds / 60)}分`; return `${(seconds / 3600).toFixed(1)}时`; };
const initials = (name) => { const clean = String(name || 'TA').trim(); return clean.length <= 2 ? clean : clean.slice(0, 1); };
const setText = (id, value) => { const element = $(id); if (element) element.textContent = value; };
const values = (items) => items.filter((item) => item != null && item !== '');
const normalizeIdentity = (value) => String(value ?? '').trim().toLowerCase();
const identityTokens = (value) => String(value ?? '').split(/[,，/|、\s]+/).map(normalizeIdentity).filter(Boolean);

function markIdentityInput(input, value, source = 'manual') {
  if (!input || !value) return;
  input.value = String(value).trim();
  input.dataset.identitySource = source;
  input.dataset.identityValue = normalizeIdentity(value);
}
function clearTransientIdentityInputs() {
  ['myIdentity', 'contactIdentity'].forEach((id) => {
    const input = $(id); if (!input || !TRANSIENT_IDENTITY_SOURCES.has(input.dataset.identitySource)) return;
    if (!input.dataset.identityValue || normalizeIdentity(input.value) === input.dataset.identityValue) input.value = '';
    delete input.dataset.identitySource; delete input.dataset.identityValue;
  });
}
function prepareNewImport(options = {}) {
  clearTransientIdentityInputs();
  pendingImport = null;
  lastImportInfo = { unknown: 0, total: 0 };
  currentContact = 'TA';
  if (options.clearText) $('textInput').value = '';
  importRevision += 1;
  return importRevision;
}

function normalizeTimestamp(value) {
  if (typeof value === 'number' && Number.isFinite(value)) { while (value >= 100000000000) value /= 1000; if (value >= 946684800 && value <= 4102444800) return value; throw new Error(`时间戳超出支持范围：${value}`); }
  const stringValue = String(value ?? '').trim();
  if (!stringValue) throw new Error('缺少时间戳');
  if (/^\d+(\.\d+)?$/.test(stringValue)) return normalizeTimestamp(Number(stringValue));
  const parsed = Date.parse(stringValue.replace(/年|\//g, '-').replace(/月/g, '-').replace(/日/g, ''));
  if (Number.isNaN(parsed)) throw new Error(`无法解析时间：${stringValue}`);
  return parsed / 1000;
}

const PARTICIPANT_KEYS = ['senderName', 'sender_name', 'sendNickName', 'send_nick_name', 'sendMemberName', 'send_member_name', 'nickname', 'nick', 'displayName', 'display_name', 'userName', 'username', 'fromName', 'from_name', 'senderUsername', 'sender_username', 'senderId', 'sender_id', 'senderUid', 'sender_uid', 'senderUin', 'sender_uin', 'fromUserName', 'from_username', 'userId', 'user_id', 'uid', 'uin', 'talker', 'talkerId', 'talker_id', 'sender', 'from', 'author', 'role'];
const RESERVED_IDENTITIES = new Set(['me', 'self', 'mine', '我', '自己', '本人', '我方', 'them', 'other', '对方', 'ta', '她', '他', 'out', 'outgoing', 'sent', 'send', 'in', 'incoming', 'received', 'receive', 'true', 'false', '1', '0']);

function scalarValues(list) { return values(list).filter((value) => ['string', 'number', 'boolean'].includes(typeof value)).map((value) => String(value).trim()).filter(Boolean); }
function firstScalar(list) { return scalarValues(list)[0] || ''; }
function rawParticipantValues(raw) {
  const sender = raw?.sender && typeof raw.sender === 'object' ? raw.sender : {};
  return scalarValues([
    ...PARTICIPANT_KEYS.map((key) => raw?.[key]),
    sender.name, sender.nickname, sender.nick, sender.displayName, sender.display_name,
    sender.uid, sender.uin, sender.id, sender.username, sender.userName,
  ]);
}
function rawParticipantLabel(raw) {
  const fields = rawParticipantValues(raw);
  const displayFields = fields.filter((field) => !RESERVED_IDENTITIES.has(normalizeIdentity(field)) && !/^\d{5,}$/.test(field) && !/^u[_-]?\w+$/i.test(field));
  return displayFields[0] || fields.find((field) => !RESERVED_IDENTITIES.has(normalizeIdentity(field))) || fields[0] || '';
}
function rawParticipantAliases(raw) { return rawParticipantValues(raw).filter((field) => !RESERVED_IDENTITIES.has(normalizeIdentity(field))).flatMap(identityTokens); }

function buildIdentityContext(payload = {}) {
  const meta = payload && typeof payload.meta === 'object' ? payload.meta : {};
  const profile = payload && typeof payload.profile === 'object' ? payload.profile : {};
  const selfInfo = payload && typeof payload.selfInfo === 'object' ? payload.selfInfo : (payload.napcat && typeof payload.napcat.selfInfo === 'object' ? payload.napcat.selfInfo : {});
  const chatInfo = payload && typeof payload.chatInfo === 'object' ? payload.chatInfo : {};
  const peer = payload && typeof payload.peer === 'object' ? payload.peer : {};
  const myFields = scalarValues([$('myIdentity')?.value, payload.myName, payload.myNickname, payload.own_name, payload.ownNickname, payload.own_wxid, payload.ownWxid, payload.own_uin, payload.ownUin, payload.own_uid, payload.ownUid, payload.owner, payload.ownerName, payload.ownerId, payload.self, payload.selfName, payload.selfId, payload.selfUin, payload.selfUid, payload.my_wxid, payload.myUin, payload.myUid, meta.myName, meta.ownerName, meta.ownerId, meta.selfName, meta.selfId, meta.selfUin, meta.selfUid, profile.name, profile.nickname, profile.username, selfInfo.nick, selfInfo.name, selfInfo.nickname, selfInfo.uin, selfInfo.uid, chatInfo.selfName, chatInfo.selfUin, chatInfo.selfUid]);
  const contactFields = scalarValues([$('contactIdentity')?.value, payload.contact_display, payload.contactDisplay, payload.contact_name, payload.contactName, payload.contact, payload.name, payload.contact_id, payload.contactId, payload.contact_username, payload.talker, payload.talkerId, payload.peerName, payload.peer_name, payload.sessionName, payload.session_name, payload.groupName, payload.group_name, peer.peerUid, peer.peerUin, meta.contactName, meta.contactId]);
  return { myIds: new Set(myFields.flatMap(identityTokens)), contactIds: new Set(contactFields.flatMap(identityTokens)), myLabel: firstScalar(myFields), contactLabel: firstScalar(contactFields) };
}

function isTruthySendFlag(value) { return value === true || value === 1 || value === '1' || String(value ?? '').toLowerCase() === 'true'; }
function isFalsySendFlag(value) { return value === false || value === 0 || value === '0' || String(value ?? '').toLowerCase() === 'false'; }

function explicitSenderDirection(raw) {
  const direct = normalizeIdentity(firstScalar([raw.sender, raw.from, raw.author, raw.role]));
  if (['me', 'self', 'mine', '我', '自己', '本人', '我方'].includes(direct)) return 'me';
  if (['them', 'other', 'friend', 'contact', 'partner', '对方', 'ta', '她', '他'].includes(direct)) return 'them';
  if (raw.sender === 1 || raw.sender === '1') return 'me'; if (raw.sender === 0 || raw.sender === '0') return 'them';
  const direction = normalizeIdentity(raw.direction ?? raw.messageDirection ?? raw.flow ?? raw.senderType ?? raw.sender_type ?? raw.message_direction);
  if (['out', 'outgoing', 'sent', 'send', 'self', 'mine', '发送', '发出', '我方'].includes(direction)) return 'me';
  if (['in', 'incoming', 'received', 'receive', 'friend', 'contact', 'partner', 'other', '接收', '收到'].includes(direction)) return 'them';
  if (direction === '1') return 'me'; if (direction === '0') return 'them';
  const sendFlag = raw.isSend ?? raw.is_send ?? raw.isSent ?? raw.is_sender ?? raw.fromMe ?? raw.from_me ?? raw.sentByMe ?? raw.isMine ?? raw.is_from_me ?? raw.isFromMe ?? raw.from_self ?? raw.isFromSelf;
  if (sendFlag !== undefined) { if (isTruthySendFlag(sendFlag)) return 'me'; if (isFalsySendFlag(sendFlag)) return 'them'; }
  if (raw.isSelf !== undefined || raw.is_self !== undefined) { const flag = raw.isSelf ?? raw.is_self; if (isTruthySendFlag(flag)) return 'me'; if (isFalsySendFlag(flag)) return 'them'; }
  return null;
}

function inferIdentity(payload, rawMessages, context) {
  const participants = new Map(); const markedMe = new Set(); const markedThem = new Set(); let directionKnown = false;
  const mark = (label, side) => { const key = normalizeIdentity(label); if (!key) return; (side === 'me' ? markedMe : markedThem).add(key); };
  rawMessages.forEach((raw) => {
    const label = rawParticipantLabel(raw); const key = normalizeIdentity(label); const aliases = rawParticipantAliases(raw);
    if (key) { const current = participants.get(key) || { key, label, count: 0, aliases: new Set() }; current.count += 1; aliases.forEach((alias) => current.aliases.add(alias)); participants.set(key, current); }
    const direction = explicitSenderDirection(raw); if (direction) { directionKnown = true; mark(label, direction); }
    if (aliases.some((alias) => context.myIds.has(alias)) || context.myIds.has(key)) mark(label, 'me');
    if (aliases.some((alias) => context.contactIds.has(alias)) || context.contactIds.has(key)) mark(label, 'them');
  });
  const candidates = [...participants.values()].filter((item) => !RESERVED_IDENTITIES.has(item.key)).sort((a, b) => b.count - a.count).map((item) => item.label);
  const findMarked = (marked) => candidates.find((label) => marked.has(normalizeIdentity(label)));
  let myLabel = context.myLabel || findMarked(markedMe) || '';
  let contactLabel = context.contactLabel || findMarked(markedThem) || '';
  if (!myLabel && contactLabel && candidates.length === 2 && candidates.some((label) => normalizeIdentity(label) === normalizeIdentity(contactLabel))) myLabel = candidates.find((label) => normalizeIdentity(label) !== normalizeIdentity(contactLabel)) || '';
  if (!contactLabel && myLabel) contactLabel = candidates.find((label) => normalizeIdentity(label) !== normalizeIdentity(myLabel)) || '';
  const ambiguous = !myLabel && candidates.length >= 2 && !directionKnown;
  return { candidates, myLabel, contactLabel, ambiguous, directionKnown };
}

function applyIdentityToContext(context, identity) { identityTokens(identity.myLabel).forEach((id) => context.myIds.add(id)); identityTokens(identity.contactLabel).forEach((id) => context.contactIds.add(id)); return context; }

function normalizeSender(raw, context) {
  const explicit = explicitSenderDirection(raw); if (explicit) return explicit;
  const sender = raw?.sender && typeof raw.sender === 'object' ? raw.sender : {};
  const direct = normalizeIdentity(firstScalar([raw.sender, raw.from, raw.author, raw.role, sender.name, sender.nickname, sender.nick]));
  if (/^(我|自己|本人)(\s|[（(]|$)/.test(direct)) return 'me'; if (/^(对方|ta|她|他)(\s|[（(]|$)/.test(direct)) return 'them';
  const ids = rawParticipantAliases(raw); if (ids.some((id) => context.myIds.has(id))) return 'me'; if (ids.some((id) => context.contactIds.has(id))) return 'them'; if (context.myIds.has(direct)) return 'me'; if (context.contactIds.has(direct)) return 'them'; if (context.myIds.size && ids.some((id) => id && !context.myIds.has(id))) return 'them'; return null;
}

function decodeXmlEntities(value) {
  return String(value ?? '').replace(/&quot;|&#34;/gi, '"').replace(/&apos;|&#39;/gi, "'").replace(/&lt;|&#60;/gi, '<').replace(/&gt;|&#62;/gi, '>').replace(/&amp;|&#38;/gi, '&');
}
function stripMarkup(value) { return decodeXmlEntities(value).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim(); }
function xmlAttribute(xml, names) {
  for (const name of names) {
    const match = String(xml).match(new RegExp(`(?:^|\\s)${name}\\s*=\\s*["']([^"']*)["']`, 'i'));
    if (match?.[1]) return stripMarkup(match[1]);
  }
  return '';
}
function xmlTagText(xml, names) {
  for (const name of names) {
    const match = String(xml).match(new RegExp(`<${name}\\b[^>]*>([\\s\\S]*?)</${name}>`, 'i'));
    const value = stripMarkup(match?.[1] || '');
    if (value) return value;
  }
  return '';
}
function structuredContentLabel(value) {
  const text = decodeXmlEntities(String(value ?? '')).trim();
  if (!/<\s*(?:msg|appmsg|sysmsg|recorditem|bizmsg|finder|patmsg)\b/i.test(text)) return '';
  const isSystem = /<\s*(?:sysmsg|patmsg)\b/i.test(text);
  const isApp = /<\s*(?:appmsg|recorditem|finder)\b/i.test(text);
  const label = xmlTagText(text, ['title', 'des', 'description', 'appname', 'sourcedisplayname']) || xmlAttribute(text, ['certinfo', 'nickname', 'nickName', 'title', 'desc', 'appname', 'sourcedisplayname', 'name', 'label', 'alias']);
  const cleanLabel = label && !/^https?:\/\//i.test(label) && label.length < 120 ? label : '';
  if (isSystem) return '[系统消息]';
  if (isApp) return cleanLabel ? `[应用消息] ${cleanLabel}` : '[应用消息]';
  return cleanLabel ? `[名片消息] ${cleanLabel}` : '[结构化消息]';
}

function exportedElementLabel(element = {}) {
  const type = normalizeIdentity(element.type ?? element.elementType ?? element.element_type);
  const data = element.data && typeof element.data === 'object' ? element.data : {};
  const textElement = element.textElement && typeof element.textElement === 'object' ? element.textElement : {};
  const directText = firstScalar([element.text, element.content, textElement.content, data.text, data.content, data.caption, data.description, data.title]);
  if (directText) return structuredContentLabel(directText) || directText;
  if (type === 'text' || type === '1') return '';
  if (type === 'image' || type === '2' || element.picElement) return '[图片]';
  if (type === 'video' || type === '19' || element.videoElement) return '[视频]';
  if (type === 'audio' || type === 'ptt' || type === '21' || element.pttElement) return '[语音]';
  if (type === 'file' || element.fileElement) return '[文件]';
  if (type === 'face' || type === 'market_face' || type === '6' || element.faceElement || element.marketFaceElement) return '[表情]';
  if (type === 'reply' || type === '7' || element.replyElement) return '[回复]';
  if (type === 'system' || type === '8' || element.grayTipElement) return '[系统]';
  if (type) return `[${type}]`;
  return '';
}
function contentFromElements(elements) {
  if (!Array.isArray(elements)) return '';
  return elements.map(exportedElementLabel).filter(Boolean).join(' ').trim();
}
function normalizeContent(raw) {
  const value = raw.content ?? raw.text ?? raw.contentText ?? raw.content_text ?? raw.msgContent ?? raw.msg_content ?? raw.parsedContent ?? raw.rawContent ?? raw.raw_content ?? raw.message ?? raw.body ?? '';
  if ((typeof value === 'string' || typeof value === 'number') && String(value).trim()) return structuredContentLabel(value) || String(value);
  if (value && typeof value === 'object') {
    const nested = firstScalar([value.text, value.content, value.desc, value.description, value.title, value.caption]);
    if (nested) return structuredContentLabel(nested) || nested;
    const nestedElements = contentFromElements(value.elements);
    if (nestedElements) return nestedElements;
  }
  const elementText = contentFromElements(raw.elements);
  return elementText || (raw.msgType === 5 || raw.messageType === 'system' ? '[系统]' : '');
}
function normalizeMessage(raw, index, context = { myIds: new Set(), contactIds: new Set() }) {
  if (!raw || typeof raw !== 'object') throw new Error(`第 ${index + 1} 条不是对象`);
  const timestamp = normalizeTimestamp(raw.timestamp ?? raw.createTime ?? raw.create_time ?? raw.time ?? raw.sendTime ?? raw.msgTime ?? raw.created_at);
  const messageType = raw.system || raw.msgType === 5 || raw.messageType === 'system' || raw.elementType === 8 ? 'system' : String(raw.type ?? raw.localType ?? raw.kind ?? raw.msgType ?? 'text').toLowerCase();
  return { ...raw, local_id: raw.local_id ?? raw.localId ?? raw.messageId ?? raw.msgId ?? index + 1, sender: normalizeSender(raw, context), timestamp, type: messageType, content: normalizeContent(raw), transcript: String(raw.transcript ?? raw.voice_transcript ?? raw.voiceTranscript ?? raw.asr ?? '') };
}

function parseText(text) {
  const rawMessages = []; const context = buildIdentityContext(); const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean); const linePattern = /^\[?([^\]]{8,25})\]?\s+(.+?)[:：]\s*(.*)$/;
  lines.forEach((line) => { const match = line.match(linePattern); if (!match) return; const [, time, senderLabel, content] = match; rawMessages.push({ timestamp: time, sender: senderLabel.trim(), content: structuredContentLabel(content) || content }); });
  if (!rawMessages.length) throw new Error('没有识别到聊天行。格式示例：[2026-08-12 20:10] 我: 你好');
  const identity = inferIdentity({}, rawMessages.filter((raw) => !isSyntheticMessage(raw)), context); applyIdentityToContext(context, identity); const messages = rawMessages.map((raw, index) => normalizeMessage(raw, index, context)).sort((a, b) => a.timestamp - b.timestamp); lastImportInfo = { unknown: messages.filter((message) => !message.sender).length, total: messages.length, ...identity, source: 'text' }; currentContact = identity.contactLabel || $('contactIdentity')?.value?.trim() || 'TA'; if (!messages.some((message) => message.sender)) { pendingImport = { rawText: text, filename: '' }; throw new Error(identity.candidates.length >= 2 ? `已识别到双方昵称：${identity.candidates.join('、')}，但无法确认哪个是你。请在下方选择本人昵称。` : '没有识别出发送方向。请确认文本中有“我 / TA”标签，或填写本人昵称 / ID。'); } return messages;
}

function parsePayload(rawText, filename = '') {
  const trimmed = rawText.trim(); const looksLikeText = /^\[?[^\]\r\n]{8,25}\]?\s+.+?[:：]/.test(trimmed); const isJson = filename.toLowerCase().endsWith('.json') || trimmed.startsWith('{') || (trimmed.startsWith('[') && !looksLikeText);
  if (isJson) {
    try {
      const payload = JSON.parse(trimmed); const rawMessages = Array.isArray(payload) ? payload : payload.messages; if (!Array.isArray(rawMessages)) throw new Error('JSON 顶层需要是数组，或包含 messages 数组'); const context = buildIdentityContext(Array.isArray(payload) ? {} : payload); const identity = inferIdentity(payload, rawMessages.filter((raw) => !isSyntheticMessage(raw)), context); applyIdentityToContext(context, identity); const messages = rawMessages.map((raw, index) => normalizeMessage(raw, index, context)).sort((a, b) => a.timestamp - b.timestamp); lastImportInfo = { unknown: messages.filter((message) => !message.sender).length, total: rawMessages.length, ...identity, source: 'json' }; const payloadContact = Array.isArray(payload) ? '' : firstScalar([payload.contact_display, payload.contactDisplay, payload.contact_name, payload.contactName, payload.contact, payload.name, payload.peerName, payload.chatInfo?.name]); currentContact = payloadContact || identity.contactLabel || $('contactIdentity')?.value?.trim() || 'TA'; if (!messages.some((message) => message.sender)) { pendingImport = { rawText, filename }; throw new Error(identity.candidates.length >= 2 ? `已识别到双方昵称：${identity.candidates.join('、')}，但无法确认哪个是你。请在下方选择本人昵称。` : '没有识别出发送方向。请在“我的昵称 / ID”中填写本人标识，或确认 JSON 含有 isSend / direction / senderUsername 字段。'); } pendingImport = null; return messages;
    } catch (error) { if (filename.toLowerCase().endsWith('.json') || !looksLikeText) throw error; }
  }
  currentContact = $('contactIdentity')?.value?.trim() || 'TA'; lastImportInfo = { unknown: 0, total: 0 }; const messages = parseText(trimmed).sort((a, b) => a.timestamp - b.timestamp); pendingImport = null; return messages;
}

function isSyntheticMessage(message = {}) {
  const content = String(message?.content ?? '').trim();
  const type = normalizeIdentity(message?.type ?? message?.messageType ?? message?.kind);
  const exportedType = String(message?.msgType ?? '').trim();
  const hasGrayTip = Array.isArray(message?.elements) && message.elements.some((element) => String(element?.elementType ?? element?.type ?? '').toLowerCase() === '8' || element?.grayTipElement);
  return ['system', 'notification', 'date', 'time'].includes(type) || exportedType === '5' || hasGrayTip || /^\s*(?:\[系统\]|系统消息|system message|notification)\s*/i.test(content);
}
function analyticalText(message) { const content = String(message.content ?? '').trim(); const transcript = String(message.transcript ?? '').trim(); const nonText = /^(?:\[(?:图片|视频|语音|文件|表情|链接|回复|名片消息|应用消息|系统消息|结构化消息|卡片消息)\]|\[(?:名片消息|应用消息|结构化消息|卡片消息)\]\s+)/; if (content && !nonText.test(content)) return content; return transcript && !nonText.test(transcript) ? transcript : ''; }
function detectSessions(messages) { const sessions = []; let current = []; messages.forEach((message, index) => { if (index && message.timestamp - messages[index - 1].timestamp > 3 * 3600) { sessions.push(current); current = []; } current.push(message); }); if (current.length) sessions.push(current); return sessions; }
function averageReply(messages) { const result = { me: [], them: [] }; for (let i = 1; i < messages.length; i += 1) { const previous = messages[i - 1]; const message = messages[i]; const gap = message.timestamp - previous.timestamp; if (message.sender !== previous.sender && gap >= 10 && gap <= 86400) result[message.sender].push(gap); } const avg = (list) => list.length ? list.reduce((sum, value) => sum + value, 0) / list.length : null; return { me: avg(result.me), them: avg(result.them), samplesMe: result.me.length, samplesThem: result.them.length }; }
function countRuns(messages) { const result = { me: 0, them: 0, maxMe: 0, maxThem: 0 }; let last = null; let run = 0; const flush = () => { if (last && run >= 3) result[last] += 1; if (last === 'me') result.maxMe = Math.max(result.maxMe, run); if (last === 'them') result.maxThem = Math.max(result.maxThem, run); }; messages.forEach((message) => { if (message.sender === last) run += 1; else { flush(); last = message.sender; run = 1; } }); flush(); return result; }
function countKeywords(text, words) { return words.reduce((sum, word) => sum + (text.includes(word) ? 1 : 0), 0); }
function keywordHits(messages, words) { return messages.reduce((sum, message) => sum + countKeywords(message.content, words), 0); }
function coefficientOfVariation(messages, sender, cutoff) { const daily = {}; messages.filter((message) => message.sender === sender && message.timestamp >= cutoff).forEach((message) => { const key = dateText(message.timestamp); daily[key] = (daily[key] || 0) + 1; }); const valuesList = Object.values(daily); if (valuesList.length < 2) return 0; const mean = valuesList.reduce((sum, value) => sum + value, 0) / valuesList.length; const variance = valuesList.reduce((sum, value) => sum + (value - mean) ** 2, 0) / valuesList.length; return mean ? Math.sqrt(variance) / mean : 0; }
function scoreFromSignals(count) { return Math.min(100, Math.round(count * 9)); }
function formatRatio(positive, negative) { if (!positive && !negative) return '暂无样本'; if (!negative) return `${positive || 0}:0`; return `${(positive / negative).toFixed(1)}:1`; }

function detectHorsemen(textMessages, cold, longGaps) { const matches = { '批评': ['你就是', '你从来', '你怎么总是', '都怪你'], '蔑视': ['可笑', '呵呵', '笑死', '跟你说不清楚', '有病'], '防御': ['不是我', '那是因为你', '凭什么怪我', '我已经'], '冷战 / 筑墙': [] }; const detected = Object.entries(matches).filter(([name, words]) => name !== '冷战 / 筑墙' && textMessages.some((message) => words.some((word) => message.content.includes(word)))).map(([name]) => name); if (cold.them / Math.max(textMessages.filter((message) => message.sender === 'them').length, 1) > .2 || longGaps.length >= 2) detected.push('冷战 / 筑墙'); return [...new Set(detected)]; }
const RELATIONSHIP_RULES = [
  { domain: 'family', type: '亲情 / 家人关系', name: '亲属称谓', summary: '记录里出现了较明确的亲属称谓或家庭照料场景，更接近家人之间的往来。', strong: /爸爸|妈妈|爸妈|父亲|母亲|爷爷|奶奶|外公|外婆|哥哥|姐姐|弟弟|妹妹|叔叔|阿姨|舅舅|姑姑|儿子|女儿|孩子/, support: /回家|家里|吃饭|身体|照顾|买菜|过年|生日/ },
  { domain: 'hierarchy', type: '师生 / 上下级关系', name: '身份与指导词', summary: '记录里出现了老师、导师、领导或汇报审批等上下级场景，更接近指导或组织关系。', strong: /老师|导师|教授|校长|老板|领导|组长|师傅|学长|学姐|学弟|学妹|下属/, support: /上课|答辩|论文|汇报|审批|任务|绩效|指导|批改/ },
  { domain: 'work', type: '同事 / 工作关系', name: '工作场景词', summary: '记录里反复出现项目、会议、客户或工作场景，更接近同事或职场协作。', strong: /同事|客户|部门|公司|项目|实习|工作|上班|下班|甲方|乙方/, support: /开会|会议|汇报|需求|排期|交付|合同|报价|发票|报销|审批|绩效|上线/ },
  { domain: 'classmate', type: '同学 / 校园关系', name: '校园身份词', summary: '记录里出现了同学、室友或课程学习场景，更接近同学、室友或校园关系。', strong: /同学|室友|舍友|同门|校友/, support: /课程|作业|考试|上课|宿舍|校园|社团|毕业|答辩/ },
  { domain: 'collaboration', type: '合作 / 事务关系', name: '事务协作词', summary: '记录主要围绕合作、订单、资料或交付展开，更接近事务型协作关系。', strong: /合作|订单|合同|报价|付款|发票|售后|客户|甲方|乙方/, support: /资料|文件|链接|需求|交付|接口|方案|对接|任务|安排/ },
  { domain: 'friendship', type: '朋友 / 熟人关系', name: '朋友身份词', summary: '记录里出现了朋友、兄弟、搭子或共同娱乐活动，更接近朋友或熟人关系。', strong: /好朋友|最好的朋友|老朋友|朋友关系|朋友们|兄弟|姐妹|闺蜜|哥们|老铁|搭子|发小/, support: /一起玩|开黑|聚会|吃饭|旅游|打球|电影|游戏|玩/ },
  { domain: 'romantic', type: '浪漫关系候选', name: '浪漫关系词', summary: '记录里出现了较明确的浪漫关系或亲密表达，但是否进入恋爱仍需结合主动、落地和持续行动。', strong: /男朋友|女朋友|对象|恋爱|在一起|爱你|想你|好想你|宝贝|宝宝|亲爱的|老公|老婆|丈夫|妻子|约会|心动|牵手|拥抱|亲亲|吃醋|纪念日|想见你/, support: /喜欢你|对你有感觉|晚安|下次见/ },
];
const ROMANTIC_RISK_TYPES = new Set(['爱情轰炸', '理想化—贬低—抛弃', '未来承诺未落地', '单相思痴迷']);

function relationshipRuleEvidence(messages, rule) {
  const strong = messages.filter((message) => rule.strong.test(message.content));
  const support = messages.filter((message) => rule.support.test(message.content));
  const all = [...strong, ...support].filter((message, index, list) => list.findIndex((item) => item.timestamp === message.timestamp && item.sender === message.sender) === index);
  return { strong, support, all, score: strong.length * 5 + support.length * 1.5 };
}

function classifyRelationship(analysis) {
  const messages = analysis.textMessages || [];
  const ranked = RELATIONSHIP_RULES.map((rule) => ({ rule, ...relationshipRuleEvidence(messages, rule) })).sort((a, b) => b.score - a.score);
  const top = ranked[0];
  const second = ranked[1];
  if (!top || !top.all.length || top.score < 4) {
    return { domain: 'unknown', type: '关系待确认', name: '关系称谓不足', confidence: '低', confidenceScore: 22, summary: '当前记录没有捕捉到足够稳定的关系称谓或场景词，先按普通熟人互动观察，不把亲密表达直接等同于恋爱。', signals: [], evidence: [], isRomantic: false };
  }
  const isSocialBlend = second && second.score >= top.score * .72 && ((top.rule.domain === 'classmate' && second.rule.domain === 'friendship') || (top.rule.domain === 'friendship' && second.rule.domain === 'classmate'));
  const isWorkBlend = second && second.score >= top.score * .72 && ((top.rule.domain === 'work' && second.rule.domain === 'collaboration') || (top.rule.domain === 'collaboration' && second.rule.domain === 'work'));
  const selected = isSocialBlend
    ? { domain: 'friendship', type: '同学 / 朋友关系', name: '校园与朋友信号', summary: '记录同时出现校园身份和朋友式互动，更像从同学关系发展出的朋友往来；不把共同学习或一起玩直接解释成恋爱。', strong: [...top.strong, ...second.strong], support: [...top.support, ...second.support], all: [...top.all, ...second.all], score: top.score + second.score }
    : isWorkBlend
      ? { domain: 'work', type: '同事 / 合作关系', name: '工作与协作信号', summary: '记录同时出现职场身份和事务协作场景，更像同事或合作关系；判断重点应放在职责、边界和兑现。', strong: [...top.strong, ...second.strong], support: [...top.support, ...second.support], all: [...top.all, ...second.all], score: top.score + second.score }
      : top;
  const runnerUp = selected === top ? second : ranked[2];
  const gap = selected.score - (selected === top ? (second?.score || 0) : (runnerUp?.score || 0));
  const confidenceScore = Math.max(28, Math.min(96, Math.round(42 + selected.score * 3 + gap * 2)));
  const confidence = confidenceScore >= 72 && selected.strong.length >= 2 ? '高' : confidenceScore >= 48 ? '中' : '低';
  const uniqueAll = selected.all.filter((message, index, list) => list.findIndex((item) => item.timestamp === message.timestamp && item.sender === message.sender) === index);
  const evidence = uniqueAll.slice(0, 3);
  const selectedDomain = selected.rule?.domain || selected.domain;
  const selectedType = selected.rule?.type || selected.type;
  const selectedName = selected.rule?.name || selected.name;
  const selectedSummary = selected.summary || selected.rule?.summary || '';
  return { domain: selectedDomain, type: selectedType, name: selectedName, confidence, confidenceScore, summary: selectedSummary, signals: [{ label: selectedName, count: uniqueAll.length }, ...(selected.strong.length ? [{ label: '强信号', count: selected.strong.length }] : []), ...(selected.support.length ? [{ label: '场景信号', count: selected.support.length }] : [])], evidence, isRomantic: selectedDomain === 'romantic', runnerUp: runnerUp?.rule.type || '' };
}

function relationshipType(analysis) {
  if (analysis.relationship && !analysis.relationship.isRomantic) return [analysis.relationship.type, analysis.relationship.summary];
  if (analysis.coldIndex >= 70 && analysis.trend === '已经凉透') return ['名存实亡', '近期互动显著变少，回应模式也开始失去温度。'];
  if (analysis.initiative >= 75 && analysis.loved < 55) return ['深陷单恋', '互动主要靠你推动，TA 的回应还不足以抵消这份重量。'];
  if (analysis.symmetry >= 70 && analysis.loved >= 65 && analysis.coldIndex < 45) return ['相互喜欢', '双方都有靠近和接住话题的证据，关系具备正向循环。'];
  if (analysis.loved >= 45 && analysis.initiative >= 45) return ['暧昧拉锯', '好感与保留同时存在，关系还在试探和确认。'];
  return ['朋友边界', '当前记录更像稳定交流，还不足以证明明确的浪漫投入。'];
}

function relationshipStage(analysis) {
  const domain = analysis.relationship?.domain;
  if (analysis.trend === '已经凉透' || analysis.trend === '逐渐降温') return ['降温衰退期', '近期互动密度或情绪回应正在下降。'];
  if (domain === 'family') return [analysis.total < 80 ? '阶段性往来' : '稳定亲情往来', '重点看照料、回应和重要时刻是否持续，不用恋爱指标解释家人关系。'];
  if (domain === 'work' || domain === 'collaboration') return [analysis.total < 80 ? '协作建立期' : '稳定事务往来', '当前更适合比较任务回应、边界和兑现，而不是激情或承诺。'];
  if (domain === 'hierarchy') return [analysis.total < 80 ? '指导与磨合期' : '稳定指导 / 组织往来', '关系质量主要体现在反馈、职责边界和问题修复上。'];
  if (domain === 'classmate') return [analysis.total < 80 ? '同学熟悉期' : '稳定校园往来', '重点看共同活动、信息互助和现实相处是否持续。'];
  if (domain === 'friendship') return [analysis.total < 80 ? '朋友建立期' : '亲友维护期', '互动重点是兴趣、陪伴、信任和彼此是否愿意持续出现。'];
  if (domain === 'unknown') return ['待确认期', '关系称谓和稳定场景不足，先保留判断，等待更多可识别内容。'];
  if (analysis.futureCountTotal >= 2 && analysis.passion >= 35 && !analysis.explicitCommitment) return ['实名化前夜', '情感互动已超过普通朋友，但关系定义和稳定承诺还没有完全落地。'];
  if (analysis.total < 80) return ['初识试探期', '双方在通过频率、话题和小幅度表达测试彼此的舒适区。'];
  if (analysis.passion >= 55 && analysis.intimacy >= 45) return ['暧昧升温期', '靠近和亲密分享已经出现，接下来需要更多具体行动验证。'];
  return ['关系维护期', '互动有一定惯性，重点从“有没有感觉”转向“能否持续”。'];
}
function attachmentTendency(messages, sender, runs) { const own = messages.filter((message) => message.sender === sender); const content = own.map((message) => message.content).join(' '); const anxiety = countKeywords(content, ['你在吗', '怎么了', '不理', '是不是', '担心', '不确定', '想你', '回我']) + runs[sender] * 2; const avoidance = countKeywords(content, ['忙', '算了', '随便', '不想', '不合适', '没事', '先这样']) + own.filter((message, index) => index && message.timestamp - own[index - 1].timestamp > 86400).length; if (anxiety >= 5 && avoidance >= 4) return { label: '焦虑 × 回避混合', score: { anxiety, avoidance }, note: '靠近和撤退信号同时出现，不能只按单一类型解释。' }; if (anxiety >= avoidance + 3) return { label: '焦虑倾向', score: { anxiety, avoidance }, note: '更容易通过确认、追问和提高消息密度来获得安全感。' }; if (avoidance >= anxiety + 3) return { label: '回避倾向', score: { anxiety, avoidance }, note: '更习惯保留空间，压力升高时会减少情感暴露。' }; if (own.length >= 12) return { label: '相对安全', score: { anxiety, avoidance }, note: '表达、留白与修复暂时没有呈现单一的极端模式。' }; return { label: '证据不足', score: { anxiety, avoidance }, note: '当前文字量不足以可靠归类，仅保留可观察信号。' }; }
function communicationStyle(messages, sender, starts, positive, negative, avgLength) { const own = messages.filter((message) => message.sender === sender); const totalStarts = starts.me + starts.them; const startRatio = starts[sender] / Math.max(totalStarts, 1); const emotionRatio = (positive[sender] + negative[sender]) / Math.max(own.length, 1); const labels = []; if (startRatio > .6) labels.push('主导型'); if (emotionRatio > .18) labels.push('情绪型'); if (avgLength < 8 && emotionRatio < .12) labels.push('事务型'); if (startRatio < .35) labels.push('迎合 / 回应型'); return labels.slice(0, 2).join(' · ') || '混合型'; }
function loveLanguage(messages, sender) { const own = messages.filter((message) => message.sender === sender).map((message) => message.content).join(' '); const scores = { '肯定的言辞': countKeywords(own, ['喜欢', '爱', '开心', '谢谢', '可爱', '想你', '期待']), '精心的时刻': countKeywords(own, ['见面', '一起', '周末', '下次', '陪', '有空']), '服务的行为': countKeywords(own, ['带伞', '接你', '帮你', '记得', '给你', '查一下']), '礼物 / 分享': countKeywords(own, ['送', '买', '照片', '礼物']), '身体接触': countKeywords(own, ['抱', '拥抱', '牵手']) }; const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0]; return best && best[1] ? best[0] : '证据不足'; }

function detectRisks(analysis, textMessages, valid) {
  const userText = textMessages.filter((message) => message.sender === 'me').map((message) => message.content).join(' '); const themText = textMessages.filter((message) => message.sender === 'them').map((message) => message.content).join(' '); const recentCutoff = analysis.last - 30 * 86400; const recent = valid.filter((message) => message.timestamp >= recentCutoff); const recentSessions = detectSessions(recent); const recentStarts = { me: recentSessions.filter((s) => s[0].sender === 'me').length, them: recentSessions.filter((s) => s[0].sender === 'them').length }; const recentUserRatio = recentStarts.me / Math.max(recentStarts.me + recentStarts.them, 1); const interpretationCount = countKeywords(userText, ['她今天回我', '说明她在意', '那次她特别好', '是不是说明', '她是不是在暗示']); const dependencyCount = countKeywords(userText, ['你不回我就', '没有你我', '离不开你', '因为你不回', '难受一天']); const gapEvents = analysis.gapEvents; const revokeThem = valid.filter((message) => message.sender === 'them' && REVOKE_TYPES.has(message.type)).length; const gasCount = countKeywords(themText, ['我从来没说过', '你记错了', '你太敏感了', '你想太多了']); const early = valid.filter((message) => message.timestamp <= valid[0].timestamp + 14 * 86400); const earlySessions = detectSessions(early); const earlyTheirStarts = earlySessions.filter((s) => s[0].sender === 'them').length; const earlyTotalStarts = earlySessions.length; const earlyDeclarations = keywordHits(early.filter((message) => message.sender === 'them'), ['从来没这样喜欢过', '遇到最好的', '只想要你', '永远不会离开']); const futureMessages = textMessages.filter((message) => FUTURE_WORDS.some((word) => message.content.includes(word))); const futureConcrete = futureMessages.filter((message) => CONCRETE_FUTURE_WORDS.some((word) => message.content.includes(word))).length; const userBombEvents = analysis.runs.me; const posEarly = keywordHits(early, POSITIVE_WORDS); const negLate = keywordHits(valid.filter((message) => message.timestamp >= analysis.first + (analysis.last - analysis.first) * .55), NEGATIVE_WORDS);
  const make = (type, quantOk, textOk, quant, textual, note) => ({ type, level: quantOk && textOk ? (type === '单相思痴迷' ? '高亮预警' : '重点预警') : quantOk || textOk ? '观察提示' : '未触发', quantOk, textOk, quant, textual, note });
  return [make('煤气灯 / 感知否定', revokeThem >= 5, gasCount >= 2, `TA 撤回 ${revokeThem} 次`, gasCount ? `TA 出现 ${gasCount} 次否定记忆或感受的表达` : '未发现足够的相关原话', '需要同时看到持续性撤回与明确否定，单句“你想多了”不直接等于煤气灯。'), make('爱情轰炸', earlyTheirStarts / Math.max(earlyTotalStarts, 1) > .6 && early.length > valid.length / Math.max(analysis.days, 1) * 2, earlyDeclarations >= 3, `前 14 天 TA 发起占比 ${Math.round(earlyTheirStarts / Math.max(earlyTotalStarts, 1) * 100)}%`, earlyDeclarations ? `早期密集宣言 ${earlyDeclarations} 条` : '未发现密集承诺原话', '关系初期热情本身不是危险，重点在于热度是否伴随控制和后续落差。'), make('间歇性强化', analysis.densityCV > .6 && recentStarts.them <= 3, interpretationCount >= 2, `近 30 天 TA 消息密度变异系数 ${analysis.densityCV.toFixed(2)}`, interpretationCount ? `你的强迫性解读 ${interpretationCount} 次` : '未发现明显的强迫性解读', '统计上的忽冷忽热只有和依赖性解读同时出现时，才值得升级关注。'), make('理想化—贬低—抛弃', posEarly >= 4 && negLate >= 3, posEarly >= 4 && negLate >= 3, `早期正向词 ${posEarly}，后期负向词 ${negLate}`, '早期理想化与后期贬低信号同时出现', '要看阶段趋势，不能用一条甜言蜜语和一条争吵原话拼成结论。'), make('未来承诺未落地', futureMessages.length >= 5 && futureConcrete <= 1, futureMessages.length >= 3 && futureConcrete === 0, `未来指向 ${futureMessages.length} 条，具体规划 ${futureConcrete} 条`, futureMessages.length ? `未来表达中可落地安排 ${futureConcrete} 条` : '没有未来承诺类表达', '把“以后”与具体时间、地点、后续兑现分开统计，避免把愿望误判成欺骗。'), make('单相思痴迷', recentUserRatio > .75 && analysis.repair.them === 0 && userBombEvents >= 5, interpretationCount >= 2 && dependencyCount >= 1, `近 30 天你发起占比 ${Math.round(recentUserRatio * 100)}%，TA 修复 ${analysis.repair.them} 次，连续追发事件 ${userBombEvents} 次`, `强迫性解读 ${interpretationCount} 次，情绪依赖表达 ${dependencyCount} 次`, '这是最高优先级信号；只有两组条件同时满足才高亮。'), make('情感创伤绑定', gapEvents.length >= 3 && analysis.reboundRate > 1.3, countKeywords(userText, ['每次吵完感情更好', '对我不好但我离不开', '越吵越离不开']) >= 1, `${gapEvents.length} 次超过 24 小时沉默，反弹率 ${analysis.reboundRate.toFixed(2)}`, '未发现“痛苦反而更离不开”的明确原话', '没有痛苦经历与粘连升高的共现，不强行贴这个标签。')];
}

function analyze(messages) {
  const unknownCount = messages.filter((message) => !message.sender).length; const valid = messages.filter((message) => (message.sender === 'me' || message.sender === 'them') && !isSyntheticMessage(message)).sort((a, b) => a.timestamp - b.timestamp); if (!valid.length) throw new Error('没有可分析的聊天记录，请先确认发送方向字段。'); const textMessages = valid.map((message) => ({ ...message, content: analyticalText(message) })).filter((message) => message.content); const mine = valid.filter((message) => message.sender === 'me'); const theirs = valid.filter((message) => message.sender === 'them'); const sessions = detectSessions(valid); const starts = { me: sessions.filter((session) => session[0].sender === 'me').length, them: sessions.filter((session) => session[0].sender === 'them').length }; const replies = averageReply(valid); const runs = countRuns(valid); const first = valid[0].timestamp; const last = valid.at(-1).timestamp; const days = Math.max(1, Math.ceil((last - first) / 86400) + 1); const total = valid.length;
  const cold = { me: 0, them: 0 }; const positive = { me: 0, them: 0 }; const negative = { me: 0, them: 0 }; const hedging = { me: 0, them: 0 }; const weCount = { me: 0, them: 0 }; const futureCount = { me: 0, them: 0 }; const coldWords = {}; textMessages.forEach((message) => { const sender = message.sender; const content = message.content.trim(); if (COLD_WORDS.has(content) || content.length <= 2) { cold[sender] += 1; coldWords[content] = (coldWords[content] || 0) + 1; } positive[sender] += countKeywords(content, POSITIVE_WORDS); negative[sender] += countKeywords(content, NEGATIVE_WORDS); hedging[sender] += countKeywords(content, HEDGING_WORDS); weCount[sender] += (content.match(/我们|咱们|咱/g) || []).length; futureCount[sender] += countKeywords(content, FUTURE_WORDS); });
  const goodnight = { me: 0, them: 0 }; textMessages.forEach((message) => { if (GOODNIGHT_WORDS.some((word) => message.content.toLowerCase().includes(word))) goodnight[message.sender] += 1; }); const totalStarts = Math.max(starts.me + starts.them, 1); const myRatio = mine.length / total; const theirRatio = theirs.length / total; const replyBalance = replies.me && replies.them ? replies.them / replies.me : replies.them ? 0 : replies.me ? 10 : 1; let initiative = 20 * Math.min(myRatio / .7, 1) + 25 * Math.min((starts.me / totalStarts) / .75, 1) + (replies.me && replies.them ? 20 * Math.min(replyBalance / 10, 1) : replies.me ? 20 : 0) + 15 * Math.min((runs.me / totalStarts) / .3, 1) + (goodnight.me + goodnight.them ? 10 * Math.min((goodnight.me / (goodnight.me + goodnight.them)) / .8, 1) : 0); initiative = Math.min(Math.round(initiative), 100); const avgMineLength = mine.length ? mine.reduce((sum, message) => sum + analyticalText(message).length, 0) / mine.length : 0; const avgTheirLength = theirs.length ? theirs.reduce((sum, message) => sum + analyticalText(message).length, 0) / theirs.length : 0; let loved = 20 * Math.min(theirRatio / .5, 1) + 25 * Math.min(starts.them / (totalStarts * .4), 1) + (replies.me && replies.them ? 20 * Math.min((replies.me / replies.them) / 3, 1) : 0) + 15 * Math.min(avgTheirLength / Math.max(avgMineLength, 1), 1) + (goodnight.me + goodnight.them ? 10 * Math.min((goodnight.them / (goodnight.me + goodnight.them)) / .6, 1) : 0) + 10 * (1 - Math.min((cold.them / Math.max(theirs.length, 1)) / .3, 1)); loved = Math.min(Math.round(loved), 100); let coldIndex = 40 * Math.min((cold.them / Math.max(theirs.length, 1)) / .3, 1); if (replies.them && replies.me && replies.them > replies.me * 5) coldIndex += 30; if (theirs.length && mine.length / theirs.length > 2) coldIndex += 30; coldIndex = Math.min(Math.round(coldIndex), 100); const symmetry = Math.max(0, Math.min(100, Math.round(100 - Math.abs(initiative - loved) * .75 - coldIndex * .22)));
  const dailyMap = {}; valid.forEach((message) => { const label = dateText(message.timestamp); dailyMap[label] = (dailyMap[label] || 0) + 1; }); const dailyTrend = Object.entries(dailyMap).slice(-40).map(([label, count]) => ({ label, count })); const activeHours = Array.from({ length: 24 }, (_, hour) => ({ hour, count: valid.filter((message) => new Date(message.timestamp * 1000).getHours() === hour).length })).sort((a, b) => b.count - a.count); const gapEvents = []; for (let i = 1; i < valid.length; i += 1) { const gap = valid[i].timestamp - valid[i - 1].timestamp; if (gap >= 86400) gapEvents.push({ previous: valid[i - 1], message: valid[i], gap }); } const repair = { me: gapEvents.filter((event) => event.message.sender === 'me').length, them: gapEvents.filter((event) => event.message.sender === 'them').length }; const reboundEvents = gapEvents.filter((event) => valid.some((message) => message.timestamp >= event.message.timestamp && message.timestamp <= event.message.timestamp + 72 * 3600)); const reboundRate = gapEvents.length ? reboundEvents.length / gapEvents.length : 0; const recentCutoff = last - 30 * 86400; const densityCV = coefficientOfVariation(valid, 'them', recentCutoff); const earlySegment = valid.slice(0, Math.max(1, Math.floor(total * .3))); const lateSegment = valid.slice(Math.max(0, Math.floor(total * .7))); const density = (segment) => segment.length / Math.max(1, (segment.at(-1)?.timestamp - segment[0]?.timestamp) / 86400); const earlyDensity = density(earlySegment); const lateDensity = density(lateSegment); const trend = lateDensity > earlyDensity * 1.25 ? '升温中' : lateDensity < earlyDensity * .55 ? '已经凉透' : lateDensity < earlyDensity * .8 ? '逐渐降温' : '平稳维持';
  const passion = scoreFromSignals(keywordHits(textMessages, PASSION_WORDS)); const intimacy = scoreFromSignals(keywordHits(textMessages, INTIMACY_WORDS)); const concreteFutureMessages = textMessages.filter((message) => CONCRETE_FUTURE_WORDS.some((word) => message.content.includes(word))); const commitment = scoreFromSignals(concreteFutureMessages.length + repair.them + repair.me + Object.values(weCount).reduce((sum, value) => sum + value, 0)); const loveType = passion >= 60 && intimacy >= 60 && commitment >= 60 ? '完全之爱' : passion >= 60 && intimacy >= 45 && commitment < 55 ? '浪漫之爱' : intimacy >= 60 && passion < 50 ? '喜欢型亲密' : commitment >= 60 && passion < 45 ? '稳定承诺型' : passion >= 55 && intimacy < 40 ? '迷恋型热度' : '尚在形成';
  const futureCountTotal = Object.values(futureCount).reduce((sum, value) => sum + value, 0); const base = { total, mine: mine.length, theirs: theirs.length, first, last, days, starts, replies, runs, cold, positive, negative, hedging, weCount, futureCount, goodnight, initiative, loved, coldIndex, symmetry, dailyTrend, activeHours, repair, gapEvents, reboundRate, densityCV, trend, passion, intimacy, commitment, loveType, futureCountTotal, concreteFutureMessages, avgMineLength, avgTheirLength, textMessages, valid, unknownCount }; const [type, typeLabel] = relationshipType(base); const explicitCommitment = textMessages.some((message) => /在一起|男朋友|女朋友|对象|正式/.test(message.content)); const [stage, stageDescription] = relationshipStage({ ...base, explicitCommitment }); const userAttachment = attachmentTendency(valid, 'me', runs); const partnerAttachment = attachmentTendency(valid, 'them', runs); const userStyle = communicationStyle(valid, 'me', starts, positive, negative, avgMineLength); const partnerStyle = communicationStyle(valid, 'them', starts, positive, negative, avgTheirLength); const userLoveLanguage = loveLanguage(valid, 'me'); const partnerLoveLanguage = loveLanguage(valid, 'them'); const partnerContent = textMessages.filter((message) => message.sender === 'them'); const supportCount = keywordHits(partnerContent, ['理解', '辛苦', '在的', '陪', '没事', '谢谢你', '我也是']); const availability = cold.them / Math.max(partnerContent.length, 1) > .25 || replies.them == null ? '偏低' : supportCount >= 3 ? '偏高' : '中等';
  const analysis = { ...base, relationshipType: type, relationshipLabel: typeLabel, relationshipStage: stage, stageDescription, userAttachment, partnerAttachment, userStyle, partnerStyle, userLoveLanguage, partnerLoveLanguage, availability, supportCount, explicitCommitment }; analysis.risks = detectRisks(analysis, textMessages, valid); analysis.horsemen = detectHorsemen(textMessages, cold, gapEvents); analysis.gottmanRatio = formatRatio(Object.values(positive).reduce((sum, value) => sum + value, 0), Object.values(negative).reduce((sum, value) => sum + value, 0)); analysis.languageFinding = weCount.me + weCount.them > 2 ? `“我们”出现 ${weCount.me + weCount.them} 次，关系里已经有共同体语言；接下来要看它是否对应具体行动。` : analysis.futureCountTotal > 0 ? '你们会谈到以后，但真正能提高确定性的，是未来表达后有没有落到时间、地点和下一步。' : '语言里的情绪表达存在，但共同体和未来指向还不够稳定。';
  const longestMe = [...textMessages].filter((message) => message.sender === 'me').sort((a, b) => b.content.length - a.content.length)[0]; const longestThem = [...textMessages].filter((message) => message.sender === 'them').sort((a, b) => b.content.length - a.content.length)[0]; const firstPositive = textMessages.find((message) => countKeywords(message.content, POSITIVE_WORDS) > 0); const conflictMessage = [...textMessages].reverse().find((message) => countKeywords(message.content, NEGATIVE_WORDS) > 0); const futureMessage = concreteFutureMessages.at(-1) || textMessages.find((message) => FUTURE_WORDS.some((word) => message.content.includes(word))); const repairMessage = gapEvents.at(-1)?.message; analysis.evidence = values([longestThem && { kind: 'TA 的表达', message: longestThem, note: 'TA 的表达方式' }, longestMe && { kind: '你的表达', message: longestMe, note: '你的投入方式' }, conflictMessage && { kind: '摩擦现场', message: conflictMessage, note: '值得放回上下文观察' }]); analysis.findings = [{ title: '谁在打开对话', quote: textMessages.find((message) => message.sender === 'me') || textMessages.find((message) => message.sender === 'them'), text: `新对话由你开启 ${starts.me} 次、TA 开启 ${starts.them} 次；主动权不是感觉，而是发生过多少次。` }, { title: '回复速度是一种资源分配', quote: textMessages.find((message, index) => index && message.sender !== textMessages[index - 1].sender), text: replies.me != null && replies.them != null ? `你平均 ${humanDuration(replies.me)} 回复，TA 平均 ${humanDuration(replies.them)} 回复；差异需要结合上下文，而不是单独判定在不在乎。` : '当前记录里跨发送者回复样本不足，已把缺口保留为证据边界。' }, { title: '正负情绪如何共存', quote: firstPositive || conflictMessage, text: `正向表达 ${Object.values(positive).reduce((sum, value) => sum + value, 0)} 次，负向表达 ${Object.values(negative).reduce((sum, value) => sum + value, 0)} 次；${analysis.gottmanRatio === '暂无样本' ? '还没有足够的情绪词样本。' : `基础正负比约为 ${analysis.gottmanRatio}。`}` }, { title: '未来有没有长出脚', quote: futureMessage, text: futureMessage ? `未来指向共 ${analysis.futureCountTotal} 次，其中 ${concreteFutureMessages.length} 次包含时间、地点或具体安排；承诺感取决于落地，不取决于句子有多甜。` : '未发现明确的未来指向表达，暂不对关系承诺下结论。' }, { title: '沉默之后谁回来', quote: repairMessage, text: gapEvents.length ? `记录中有 ${gapEvents.length} 次超过 24 小时的间隔，沉默后由你修复 ${repair.me} 次、TA 修复 ${repair.them} 次。` : '没有超过 24 小时的长间隔，暂时看不到典型的冷战—修复现场。' }]; analysis.strategy = { stop: initiative >= 70 ? [{ title: '停止连续补充消息', reason: `你的连续发送峰值为 ${runs.maxMe} 条；当对方尚未回应时，信息量会替你表达焦虑。`, quote: longestMe?.content || '当前没有足够原话' }] : [{ title: '停止用一次晚回解释全部关系', reason: '先看多次互动形成的模式，再决定是否调整投入。', quote: textMessages.at(-1)?.content || '当前没有足够原话' }], start: loved >= 60 ? [{ title: '把靠近落到具体见面', reason: '聊天里的好感需要可验证的共同时间。', script: '“这周六下午我有空，要不要一起去走走？”' }, { title: '留出一次自然的主动窗口', reason: '不追问、不设局，观察 TA 是否会自己接住话题。', script: '分享一件日常，结尾不追加问题。' }] : [{ title: '减少提醒式靠近', reason: '让回应成为对方主动做出的选择。', script: '“你忙完有空再聊，我先去做自己的事。”' }, { title: '把需求说短、说清楚', reason: '清晰请求比连续试探更容易被真正回应。', script: '“我想见你，这周有一个小时吗？”' }] }; analysis.walkAway = { days: 14, trigger: coldIndex >= 60 ? '连续 3 天没有回应，且没有主动修复' : '执行两周后仍只有你在推动，TA 没有稳定主动回应', text: coldIndex >= 60 ? '先停止追问，把下一次主动留给 TA；如果冷淡模式继续重复，就把它当作信息。' : '给关系一个自然反馈窗口：你不加码之后，TA 是否仍愿意主动靠近。' };
  return analysis;
}

/*
 * 深度证据层
 * 参考 she-love-me 的“全量统计 + 关键窗口证据 + 解释”结构。
 * 这里不调用模型，也不凭空补写原话；每个画像和发现都从本次导入的消息重新计算。
 */
function deepMatches(messages, patterns) {
  return messages.filter((message) => patterns.some((pattern) => {
    if (pattern instanceof RegExp) {
      pattern.lastIndex = 0;
      return pattern.test(message.content);
    }
    return message.content.includes(String(pattern));
  }));
}
function deepFirst(messages, patterns) { return deepMatches(messages, patterns)[0] || null; }
function deepLast(messages, patterns) { const matches = deepMatches(messages, patterns); return matches.at(-1) || null; }
function deepLongest(messages) { return [...messages].sort((a, b) => b.content.length - a.content.length)[0] || null; }
function deepUnique(messages, limit = 3) {
  const seen = new Set();
  return messages.filter((message) => {
    if (!message) return false;
    const key = message.sender + '|' + message.timestamp + '|' + message.content;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, limit);
}

// 画像只使用更接近关系语境的模式，避免把“你去过吗”“明天有课”之类普通句子误当成焦虑或计划信号。
const PERSON_ANXIETY_PATTERNS = [
  /你在吗|你还在吗|在不在/,
  /(?:怎么|为什么)(?:还)?不回/,
  /不理我|回我/,
  /(?:不确定|不知道).{0,5}(?:你怎么想|你的想法|我们|关系|喜不喜欢)/,
  /是不是.{0,5}(?:不想|不在乎|烦我|生气|讨厌)/,
];
const PERSON_BOUNDARY_PATTERNS = [
  /(?:现在|今天|明天|最近|这两天)?(?:实在)?(?:在忙|忙着|没空|没时间|走不开)/,
  /(?:不能|没法|无法)陪/,
  /不方便(?:见|聊|出来)/,
  /(?:以后|回头|改天|晚点|先).{0,2}再说/,
  /算了(?:吧)?/,
  /不想(?:聊|见|继续)/,
];
const PERSON_PLAN_PATTERNS = [
  /(?:一起|咱们|我们).{0,12}(?:去|见|吃|玩|来|看)/,
  /(?:周末|周六|周日|下周|明天).{0,12}(?:有空|见|去|吃|玩|来|陪|一起|？|\?)/,
  /(?:见面|吃饭|出去|来找|来这|去你|接你).{0,10}/,
  /(?:几点|地址|地点).{0,8}/,
];

function explainPersonEvidence(profile, evidence, allMessages = []) {
  const metrics = profile.metrics;
  return evidence.map((message) => {
    const content = message.content;
    const has = (patterns) => patterns.some((pattern) => pattern instanceof RegExp ? (pattern.lastIndex = 0, pattern.test(content)) : content.includes(String(pattern)));
    let title = '表达方式';
    let analysis = '这条消息约 ' + content.length + ' 字；单条原话只能说明当时的表达方式，不能单独推出人格或关系结论。';
    if (has(PERSON_ANXIETY_PATTERNS) || /[?？]/.test(content) && /(?:你|我们|关系).{0,5}(?:怎么想|在吗|不回|是不是)/.test(content)) {
      title = '确认关系位置';
      analysis = '这条原话包含提问或确认结构。结合该方当前 ' + metrics.questionHits + ' 次提问、' + metrics.anxiety + ' 分确认信号，更像是在不确定时寻找回应，而不是单凭一句话判定焦虑。';
    } else if (has(PERSON_BOUNDARY_PATTERNS)) {
      title = '边界与撤退';
      analysis = '这条原话出现了时间、空间或延后安排的边界词。当前记录共出现 ' + metrics.boundaryHits + ' 次类似信号，需要结合对方是否随后回来、解释或提出替代方案来判断它是现实忙碌还是持续回避。';
    } else if (has(['难过', '害怕', '压力', '家里', '委屈', '累', '担心', '不舒服', '过去'])) {
      title = '脆弱与开放';
      analysis = '这条原话直接暴露了处境或情绪。当前记录中的脆弱表达共有 ' + metrics.vulnerabilityHits + ' 条，它能支持“曾经开放过”的判断，但不能自动等于长期稳定的情感可得性。';
    } else if (has(PERSON_PLAN_PATTERNS)) {
      title = '未来与行动';
      analysis = '这条原话把互动指向未来；当前该方有 ' + metrics.futureHits + ' 次未来指向，其中 ' + metrics.planHits + ' 条更接近具体时间、地点或下一步。要继续核对后续是否兑现。';
    } else if (has(['喜欢', '爱', '想你', '开心', '期待', '谢谢', '在乎', '温柔', '可爱'])) {
      title = '肯定与靠近';
      analysis = '这条原话带有肯定、感谢或靠近信号。当前该方正向情绪词共 ' + metrics.feelingHits + ' 次，说明情绪温度存在；关系判断仍要看它是否持续并转化为行动。';
    }
    const messageIndex = allMessages.indexOf(message);
    const nextContext = allMessages.slice(messageIndex + 1).find((candidate) => candidate.sender !== message.sender && candidate.timestamp - message.timestamp <= 86400);
    const previousContext = [...allMessages.slice(0, messageIndex)].reverse().find((candidate) => candidate.sender !== message.sender && message.timestamp - candidate.timestamp <= 86400);
    return { message, title, analysis, contextMessage: nextContext || previousContext || null };
  });
}
function personEvidenceMarkup(profile) {
  return profile.evidenceDetails.length
    ? profile.evidenceDetails.map((item, index) => '<article class="person-evidence-item"><div class="person-evidence-meta"><b>0' + (index + 1) + '</b><span>' + escapeHtml(item.title) + '</span><small>' + dateText(item.message.timestamp, true) + '</small></div><blockquote>“' + escapeHtml(item.message.content) + '”</blockquote>' + (item.contextMessage ? '<div class="person-evidence-context"><span>接续</span><p>' + (item.contextMessage.sender === 'me' ? '你' : 'TA') + '：' + escapeHtml(item.contextMessage.content) + '</p></div>' : '') + '<p>' + escapeHtml(item.analysis) + '</p></article>').join('')
    : '<p class="person-evidence-empty">当前记录中没有足够的可分析原话。</p>';
}

function buildDeepPersonProfile(analysis, sender) {
  const own = analysis.textMessages.filter((message) => message.sender === sender);
  const other = analysis.textMessages.filter((message) => message.sender !== sender);
  const openingTotal = Math.max(analysis.starts.me + analysis.starts.them, 1);
  const openingShare = analysis.starts[sender] / openingTotal;
  const averageLength = sender === 'me' ? analysis.avgMineLength : analysis.avgTheirLength;
  const maxRun = sender === 'me' ? analysis.runs.maxMe : analysis.runs.maxThem;
  const questionHits = deepMatches(own, [/[?？]/, '吗', '呢', '在吗', '怎么了', '为什么', '是不是', '要不要']).length;
  const concernHits = deepMatches(own, PERSON_ANXIETY_PATTERNS).length;
  const boundaryHits = deepMatches(own, PERSON_BOUNDARY_PATTERNS).length;
  const vulnerabilityHits = deepMatches(own, ['难过', '害怕', '压力', '家里', '委屈', '累', '担心', '不舒服', '过去']).length;
  const feelingHits = keywordHits(own, ['喜欢', '爱', '想你', '开心', '期待', '谢谢', '在乎', '温柔', '可爱']);
  const futureHits = keywordHits(own, FUTURE_WORDS);
  const planHits = deepMatches(own, PERSON_PLAN_PATTERNS).length;
  const supportHits = deepMatches(own, ['理解', '辛苦', '在的', '陪你', '没事', '谢谢你', '我也是']).length;
  const shortCount = own.filter((message) => message.content.length <= 4).length;
  const longPauses = own.reduce((count, message, index) => {
    if (!index || message.timestamp - own[index - 1].timestamp <= 86400) return count;
    return count + 1;
  }, 0);
  const concernRate = concernHits / Math.max(own.length, 1);
  const boundaryRate = boundaryHits / Math.max(own.length, 1);
  const feelingRate = feelingHits / Math.max(own.length, 1);
  const supportRate = supportHits / Math.max(own.length, 1);
  const vulnerabilityRate = vulnerabilityHits / Math.max(own.length, 1);
  const planRate = planHits / Math.max(own.length, 1);
  const shortRate = shortCount / Math.max(own.length, 1);
  const anxiety = Math.round(concernHits * 4 + Math.min(concernRate * 100, 8) + Math.min(analysis.hedging[sender] / Math.max(own.length, 1) * 100, 5));
  const avoidance = Math.round(boundaryHits * 4 + Math.min(boundaryRate * 100, 8));
  const openness = vulnerabilityHits * 2 + feelingHits + supportHits + planHits;
  const enoughEvidence = own.length >= 5 && own.reduce((sum, message) => sum + message.content.length, 0) >= 20;
  const anxietySignal = concernHits >= 3 && concernRate >= .015;
  const avoidanceSignal = boundaryHits >= 3 && boundaryRate >= .015;
  const balancedOpenSignal = vulnerabilityRate >= .015 || feelingRate >= .03 || supportRate >= .03;
  let attachmentLabel = '证据不足';
  let attachmentNote = '当前记录里的可分析原话不足，暂不把行为归类为稳定的人格或依恋类型。';
  if (enoughEvidence) {
    if (anxietySignal && avoidanceSignal) {
      attachmentLabel = '焦虑 × 回避混合';
      attachmentNote = '同一方在多条原话中同时出现关系不确定确认和明确延后、拒绝或撤退；需要按具体情境理解，不能只贴单一标签。';
    } else if (anxietySignal) {
      attachmentLabel = '焦虑倾向';
      attachmentNote = '当前记录里出现了多次直接的关系不确定确认；这比普通的“吗 / 呢”更接近寻找确定性的行为信号。';
    } else if (avoidanceSignal) {
      attachmentLabel = '回避倾向';
      attachmentNote = '当前记录里出现了多次明确的延后、拒绝或收回时间的表达；仍需结合之后是否回来和提出替代方案。';
    } else if (balancedOpenSignal && boundaryRate < .02) {
      attachmentLabel = '相对安全';
      attachmentNote = '当前记录里有持续的情绪承接、支持或具体行动，同时没有足够的单边确认或撤退信号；这里只描述本次聊天的互动状态。';
    } else {
      attachmentLabel = '选择性开放';
      attachmentNote = '愿意在部分话题或行动上靠近，但直接的情绪暴露和关系确认较少；当前证据不足以归入更稳定的类型。';
    }
  }
  const styleParts = [];
  if (openingShare >= .62 || (openingShare >= .52 && maxRun >= 8)) styleParts.push('主动推进型');
  else if (openingShare <= .45) styleParts.push('回应承接型');
  else styleParts.push('双向参与型');
  if (planHits >= 3 && (planHits >= feelingHits + 2 || planRate >= .05)) styleParts.push('行动规划型');
  else if (feelingRate >= .03 || vulnerabilityRate >= .015 || supportRate >= .03) styleParts.push('情绪承接型');
  else if (averageLength < 8 || shortRate > .25) styleParts.push('简短事务型');
  else styleParts.push('选择性表达型');
  const need = anxietySignal
    ? '确定性与及时回应'
    : avoidanceSignal
      ? '自主空间与低压力互动'
      : vulnerabilityHits >= 2
        ? '被理解和情绪承接'
        : planHits >= 2
          ? '把关系落实为具体行动'
          : '稳定、可预期的互动';
  const fear = anxietySignal
    ? '被忽视，关系失去确定性'
    : avoidanceSignal
      ? '被追问，失去自己的空间'
      : openness < 3
        ? '投入没有被接住'
        : '表达之后得不到持续回应';
  const trust = supportHits + planHits >= 3
    ? '通过回应、照顾和兑现具体安排累积信任'
    : boundaryHits >= 3 || analysis.hedging[sender] >= 3
      ? '更依赖可预期的节奏和边界感来判断是否安全'
      : '目前主要依靠聊天频率和当下回应来建立信任';
  const defenseDefinitions = [
    { label: '确认性追问', patterns: PERSON_ANXIETY_PATTERNS, note: '不确定时通过问题确认关系位置。' },
    { label: '边界式撤退', patterns: PERSON_BOUNDARY_PATTERNS, note: '压力上升时先收回时间或情绪暴露。' },
    { label: '理性化处理', patterns: ['最近事情有点多', '工作忙', '学习忙', '有点事', '来不及'], note: '用事务原因解释互动变化，减少直接谈感受。' },
    { label: '情绪选择性开放', patterns: ['难过', '压力', '家里', '委屈', '担心', '喜欢', '想你'], note: '只在特定窗口暴露脆弱或在乎。' },
  ];
  const defenses = defenseDefinitions.map((item) => {
    const evidence = deepFirst(own, item.patterns);
    return evidence ? { label: item.label, note: item.note, evidence } : null;
  }).filter(Boolean).slice(0, 3);
  const evidence = deepUnique([
    deepFirst(own, PERSON_ANXIETY_PATTERNS),
    deepFirst(own, PERSON_BOUNDARY_PATTERNS),
    deepFirst(own, ['难过', '压力', '家里', '委屈', '担心']),
    deepFirst(own, PERSON_PLAN_PATTERNS),
    deepFirst(own, ['喜欢', '爱', '想你', '开心', '期待', '谢谢', '在乎', '温柔', '可爱']),
    deepLongest(own),
    own.at(-1),
    ...own,
  ], 5);
  const anchor = evidence[0] || deepLongest(own) || other[0] || null;
  const evidenceDetails = explainPersonEvidence({ metrics: { questionHits, concernHits, boundaryHits, vulnerabilityHits, feelingHits, futureHits, planHits, supportHits, shortCount, longPauses, anxiety, avoidance, openness, maxRun } }, evidence, analysis.textMessages);
  const summary = own.length
    ? (sender === 'me' ? '你' : 'TA') + '在当前记录里有 ' + own.length + ' 条可分析文字，开启对话占比 ' + Math.round(openingShare * 100) + '%，平均每条约 ' + Math.round(averageLength) + ' 字。'
    : '当前记录里没有足够的文字表达可供画像。';
  return {
    sender,
    messageCount: own.length,
    openingShare,
    averageLength,
    metrics: { questionHits, concernHits, boundaryHits, vulnerabilityHits, feelingHits, futureHits, planHits, supportHits, shortCount, longPauses, anxiety, avoidance, openness, maxRun, concernRate, boundaryRate, feelingRate, supportRate, vulnerabilityRate, planRate, shortRate, anxietySignal, avoidanceSignal },
    style: styleParts.join(' · '),
    attachment: { label: attachmentLabel, score: { anxiety, avoidance }, note: attachmentNote },
    need,
    fear,
    trust,
    defenses,
    evidence,
    evidenceDetails,
    anchor,
    summary,
  };
}

function deepResponsePairs(messages) {
  const pairs = [];
  for (let index = 1; index < messages.length; index += 1) {
    const previous = messages[index - 1];
    const response = messages[index];
    const gap = response.timestamp - previous.timestamp;
    if (previous.sender !== response.sender && gap >= 10 && gap <= 86400) pairs.push({ previous, response, gap });
  }
  return pairs;
}

function deepRelationshipType(analysis, me, them) {
  if (analysis.relationship && !analysis.relationship.isRomantic) return [analysis.relationship.type, analysis.relationship.summary];
  const partnerMessages = analysis.textMessages.filter((message) => message.sender === 'them');
  const convenienceHits = deepMatches(partnerMessages, ['帮我', '顺便', '给我', '需要你', '你能不能']).length;
  if (analysis.coldIndex >= 70 && (analysis.trend === '已经凉透' || analysis.trend === '逐渐降温')) return ['名存实亡', '近期互动显著变少，回应模式也开始失去温度。'];
  if (analysis.initiative >= 75 && analysis.loved < 55 && me.metrics.anxiety >= them.metrics.anxiety) return ['深陷单恋', '互动主要靠你推动，TA 的回应还不足以抵消这份重量。'];
  if (analysis.initiative >= 70 && convenienceHits >= 3 && them.metrics.feelingHits <= 1 && them.metrics.supportHits <= 1) return ['情感工具人', '你的投入和服务性行动很明显，但对方的情绪承接与关系投入证据偏少。'];
  if (analysis.initiative >= 60 && them.metrics.futureHits >= 5 && them.metrics.planHits <= 1 && them.metrics.feelingHits <= 1) return ['备胎危机', '对方保留了未来话题，却很少给出具体安排；这需要用后续兑现来验证，而不是直接当成事实。'];
  if (analysis.symmetry >= 70 && analysis.loved >= 65 && analysis.coldIndex < 45 && me.metrics.feelingHits >= 2 && them.metrics.feelingHits >= 2) return ['相互喜欢', '双方都有靠近、表达和接住话题的证据，关系具备正向循环。'];
  if (analysis.loved >= 45 && analysis.initiative >= 45) return ['暧昧拉锯', '好感与保留同时存在，关系还在试探和确认。'];
  return ['朋友边界', '当前记录更像稳定交流，还不足以证明明确的浪漫投入。'];
}

function enrichAnalysis(analysis) {
  const me = buildDeepPersonProfile(analysis, 'me');
  const them = buildDeepPersonProfile(analysis, 'them');
  const displayName = String(currentContact || 'TA').replace(/^\s*unplun\s*/i, '').trim() || 'TA';
  currentContact = displayName;
  analysis.displayContactName = displayName;
  analysis.personProfiles = { me, them };
  analysis.userAttachment = me.attachment;
  analysis.partnerAttachment = them.attachment;
  analysis.userStyle = me.style;
  analysis.partnerStyle = them.style;
  analysis.userLoveLanguage = loveLanguage(analysis.valid, 'me');
  analysis.partnerLoveLanguage = loveLanguage(analysis.valid, 'them');
  analysis.relationship = classifyRelationship(analysis);
  const [deepType, deepTypeLabel] = deepRelationshipType(analysis, me, them);
  analysis.relationshipType = deepType;
  analysis.relationshipLabel = deepTypeLabel;
  const explicitCommitment = analysis.explicitCommitment || analysis.textMessages.some((message) => /在一起|男朋友|女朋友|对象|正式/.test(message.content));
  const [stage, stageDescription] = relationshipStage({ ...analysis, explicitCommitment });
  analysis.relationshipStage = stage;
  analysis.stageDescription = stageDescription;
  analysis.explicitCommitment = explicitCommitment;
  const partnerShortRatio = them.metrics.shortCount / Math.max(them.messageCount, 1);
  const partnerLongPauses = them.metrics.longPauses;
  analysis.availability = them.messageCount < 5
    ? '证据不足'
    : partnerShortRatio > .3 || partnerLongPauses >= 3
      ? '偏低'
      : them.metrics.supportHits + them.metrics.planHits >= 3 && analysis.starts.them > 0
        ? '偏高'
        : '中等';
  analysis.supportCount = them.metrics.supportHits;
  const textSessions = detectSessions(analysis.textMessages);
  const openingMessages = textSessions.map((session) => session[0]).filter(Boolean);
  const endingCounts = { me: 0, them: 0 };
  textSessions.forEach((session) => {
    const last = session.at(-1);
    if (last?.sender) endingCounts[last.sender] += 1;
  });
  analysis.powerDynamics = { openingMessages, endingCounts, leader: analysis.starts.me >= analysis.starts.them ? '你' : displayName };
  const dailyText = {};
  analysis.textMessages.forEach((message) => {
    const day = dateText(message.timestamp);
    if (!dailyText[day]) dailyText[day] = [];
    dailyText[day].push(message);
  });
  const peakEntry = Object.entries(dailyText).sort((a, b) => b[1].length - a[1].length)[0];
  analysis.turningPoint = peakEntry ? { date: peakEntry[0], count: peakEntry[1].length, message: peakEntry[1][0] } : null;
  analysis.repairDetails = analysis.gapEvents.map((event) => {
    const followUp = analysis.valid.find((message) => message.timestamp >= event.message.timestamp && message.timestamp <= event.message.timestamp + 24 * 3600 && message.sender !== event.message.sender);
    return { ...event, resumedBy: event.message.sender, resumeMessage: event.message, followUp, repairObserved: Boolean(followUp) };
  });
  analysis.repairSuccess = analysis.repairDetails.filter((event) => event.repairObserved).length;
  const responsePairs = deepResponsePairs(analysis.textMessages);
  const slowestResponse = [...responsePairs].sort((a, b) => b.gap - a.gap)[0] || null;
  const fastestResponse = [...responsePairs].sort((a, b) => a.gap - b.gap)[0] || null;
  analysis.responseEvidence = { samples: responsePairs.length, slowest: slowestResponse, fastest: fastestResponse };
  analysis.triangleEvidence = {
    passion: deepUnique([deepLast(analysis.textMessages, PASSION_WORDS)], 1),
    intimacy: deepUnique([deepLast(analysis.textMessages, INTIMACY_WORDS)], 1),
    commitment: deepUnique([deepLast(analysis.textMessages, CONCRETE_FUTURE_WORDS)], 1),
  };
  const evidence = [];
  const addEvidence = (kind, message, note) => {
    if (!message || !message.content) return;
    if (evidence.some((item) => item.message.sender === message.sender && item.message.timestamp === message.timestamp && item.message.content === message.content)) return;
    evidence.push({ kind, message, note });
  };
  addEvidence('你的表达', me.anchor, me.summary);
  addEvidence(displayName + ' 的表达', them.anchor, them.summary);
  addEvidence('互动高峰', analysis.turningPoint?.message, analysis.turningPoint ? analysis.turningPoint.date + ' 共 ' + analysis.turningPoint.count + ' 条文字消息，是当前记录的互动高峰。' : '');
  addEvidence('具体安排', deepLast(analysis.textMessages, CONCRETE_FUTURE_WORDS), '把未来表达和具体时间、地点、下一步分开观察。');
  addEvidence('情绪现场', deepLast(analysis.textMessages, [...POSITIVE_WORDS, ...NEGATIVE_WORDS]), '这是当前记录中可回放的情绪表达，不单独等同于关系结论。');
  addEvidence('沉默后的重启', analysis.repairDetails.at(-1)?.resumeMessage, '长间隔之后重新出现的第一条消息。');
  analysis.evidence = evidence.slice(0, 7);
  const longestMe = deepLongest(analysis.textMessages.filter((message) => message.sender === 'me'));
  const longestThem = deepLongest(analysis.textMessages.filter((message) => message.sender === 'them'));
  const openingQuote = openingMessages[0] || analysis.textMessages[0] || null;
  const emotionMessages = analysis.textMessages.filter((message) => countKeywords(message.content, POSITIVE_WORDS) + countKeywords(message.content, NEGATIVE_WORDS) > 0);
  const emotionQuote = [...emotionMessages].sort((a, b) => (countKeywords(b.content, POSITIVE_WORDS) + countKeywords(b.content, NEGATIVE_WORDS)) - (countKeywords(a.content, POSITIVE_WORDS) + countKeywords(a.content, NEGATIVE_WORDS)))[0] || null;
  const futureQuote = deepLast(analysis.textMessages, CONCRETE_FUTURE_WORDS) || deepLast(analysis.textMessages, FUTURE_WORDS);
  const repairQuote = analysis.repairDetails.at(-1)?.resumeMessage || null;
  analysis.findings = [
    {
      title: '谁在打开对话',
      quote: openingQuote,
      text: '全量记录里由你开启 ' + analysis.starts.me + ' 次、' + displayName + ' 开启 ' + analysis.starts.them + ' 次；对话结束时由你收尾 ' + endingCounts.me + ' 次、' + displayName + ' 收尾 ' + endingCounts.them + ' 次。开启和收尾一起看，才能判断是单向追赶，还是双方都在把对话接住。',
    },
    {
      title: '回复速度是一种资源分配',
      quote: slowestResponse?.response || fastestResponse?.response || null,
      text: responsePairs.length ? '共找到 ' + responsePairs.length + ' 个跨发送者回复样本；最慢的一次由' + (slowestResponse.response.sender === 'me' ? '你' : displayName) + '接上，等待 ' + humanDuration(slowestResponse.gap) + '。最快的一次为 ' + humanDuration(fastestResponse.gap) + '。这描述节奏差异，不直接判定在不在乎。' : '当前记录里没有足够的跨发送者回复样本，暂不把空白翻译成冷淡。',
    },
    {
      title: '正负情绪如何共存',
      quote: emotionQuote,
      text: '当前可识别的正向表达 ' + Object.values(analysis.positive).reduce((sum, value) => sum + value, 0) + ' 次、负向表达 ' + Object.values(analysis.negative).reduce((sum, value) => sum + value, 0) + ' 次；' + (emotionQuote ? '原话显示情绪确实在场，但仍需结合前后文与后续行动。' : '当前没有足够的情绪词原话，保留证据边界。'),
    },
    {
      title: '未来有没有长出脚',
      quote: futureQuote,
      text: futureQuote ? '未来指向共 ' + analysis.futureCountTotal + ' 次，其中 ' + analysis.concreteFutureMessages.length + ' 次包含时间、地点或具体安排。真正提高确定性的不是“以后”本身，而是是否形成可执行的下一步。' : '当前没有发现未来指向原话，暂不把愿望、礼貌回应或沉默强行解释成承诺。',
    },
    {
      title: '沉默之后谁回来',
      quote: repairQuote,
      text: analysis.gapEvents.length ? '记录中有 ' + analysis.gapEvents.length + ' 次超过 24 小时的间隔；间隔之后由你重启 ' + analysis.repair.me + ' 次、' + displayName + ' 重启 ' + analysis.repair.them + ' 次，其中 ' + analysis.repairSuccess + ' 次在重启后又出现了对方的跟进。' : '没有超过 24 小时的长间隔样本，暂时看不到典型的沉默—修复现场。',
    },
  ];
  const ownQuote = longestMe?.content || me.anchor?.content || '当前没有足够的你的原话';
  const partnerQuote = longestThem?.content || them.anchor?.content || '当前没有足够的 TA 原话';
  analysis.strategy = {
    stop: analysis.initiative > analysis.loved + 8 && me.metrics.maxRun >= 3
      ? [{ title: '停止连续补充消息', reason: '你的最长连续发送为 ' + me.metrics.maxRun + ' 条；当对方还没有回应时，继续加消息会让焦虑替你说话。', quote: ownQuote }]
      : [{ title: '停止用单次事件解释全部关系', reason: '先看多次互动的开启、回应和修复模式，再决定是否调整投入。', quote: ownQuote }],
    start: analysis.initiative > analysis.loved + 8
      ? [{ title: '把主动缩小成一次具体请求', reason: '当前由你开启 ' + analysis.starts.me + ' 次、' + displayName + ' 开启 ' + analysis.starts.them + ' 次，先给对方一个容易回答的窗口。', script: '“我这周六下午有空，想见你一小时；不方便也直接告诉我。”' }, { title: '留出一次不追问的窗口', reason: '发出清晰信息后不连续补充，观察对方是否会自己接住。', script: '“你忙完有空再聊，我先去做自己的事。”' }]
      : [{ title: '把积极回应落到行动', reason: '当前开启次数没有明显单边差距，下一步看具体时间和地点能否兑现。', script: '“我们都方便的话，把下次见面的时间定下来？”' }, { title: '直接说出你的需要', reason: '你的画像里' + me.need + '更突出，短句表达比反复试探更容易得到有效回应。', script: '“我想知道这件事对' + displayName + '来说是什么感觉，你愿意找个时间聊聊吗？”' }],
  };
  analysis.walkAway = {
    days: analysis.coldIndex >= 60 ? 7 : 14,
    trigger: analysis.initiative > analysis.loved + 8 ? '连续两次由你主动推进后，' + displayName + '仍不主动提出或落实下一步' : '给出一次明确请求后，连续两周没有稳定回应、主动和修复',
    text: analysis.coldIndex >= 60 ? '先停止追问，把下一次主动留给' + displayName + '；如果低回应和长等待继续重复，就把它当作信息。' : '保留一个自然反馈窗口：你不加码之后，' + displayName + '是否仍愿意主动靠近、落实和修复。',
  };
  analysis.languageFinding = analysis.weCount.me + analysis.weCount.them > 2
    ? '“我们”在当前记录里出现 ' + (analysis.weCount.me + analysis.weCount.them) + ' 次；' + (analysis.concreteFutureMessages.length ? '其中有具体安排可以核对共同体语言是否落地。' : '目前仍要观察它是否对应具体行动。')
    : analysis.futureCountTotal
      ? '未来指向出现 ' + analysis.futureCountTotal + ' 次，但只有 ' + analysis.concreteFutureMessages.length + ' 次带有时间、地点或下一步；开放式表达和可兑现安排不能混为一谈。'
      : '当前记录没有足够的共同体或未来指向表达，先保留，不强行解释关系走向。';
  analysis.dynamicSummary = {
    me: me.summary,
    them: them.summary,
    turningPoint: analysis.turningPoint,
    power: analysis.powerDynamics,
  };
  return analysis;
}

const baseAnalyze = analyze;
analyze = (messages) => enrichAnalysis(baseAnalyze(messages));

function renderNarrative(analysis) {
  const recentCutoff = analysis.last - 30 * 86400;
  const recent = analysis.valid.filter((message) => message.timestamp >= recentCutoff);
  const recentSessions = detectSessions(recent);
  const recentStarts = { me: recentSessions.filter((session) => session[0].sender === 'me').length, them: recentSessions.filter((session) => session[0].sender === 'them').length };
  const totalStarts = Math.max(analysis.starts.me + analysis.starts.them, 1);
  const recentTotalStarts = Math.max(recentStarts.me + recentStarts.them, 1);
  const myShare = Math.round(analysis.mine / Math.max(analysis.total, 1) * 100);
  const recentMyShare = Math.round(recent.filter((message) => message.sender === 'me').length / Math.max(recent.length, 1) * 100);
  const leader = analysis.starts.me >= analysis.starts.them ? '你' : currentContact;
  const userEvidence = analysis.evidence.find((item) => item.message.sender === 'me')?.message;
  const partnerEvidence = analysis.evidence.find((item) => item.message.sender === 'them')?.message;
  const quoteMarkup = (message, label) => message ? `<div class="narrative-quote"><span>${escapeHtml(label)}</span><blockquote>“${escapeHtml(message.content)}”</blockquote><small>${dateText(message.timestamp, true)} · ${message.sender === 'me' ? '你' : escapeHtml(currentContact)}</small></div>` : `<div class="narrative-quote narrative-quote-empty"><span>${escapeHtml(label)}</span><p>当前内容中没有可引用原话。</p></div>`;

  setText('reportDataLine', `${dateText(analysis.first)} 至 ${dateText(analysis.last)} · ${analysis.total.toLocaleString()} 条可识别消息${analysis.unknownCount ? ` · ${analysis.unknownCount} 条未识别方向未纳入` : ''}`);
  const conclusion = analysis.relationshipType === '相互喜欢'
    ? `${currentContact}愿意和你保持互动，记录里有双方靠近、回应和具体行动的证据；但主动推进仍不完全对称，暂时不能只凭聊天确认恋爱关系。`
    : analysis.relationshipType === '深陷单恋'
      ? `你在这段关系里承担了更多发起和维持工作，${currentContact}的回应尚不足以抵消这份投入；现阶段更需要验证对方是否会主动靠近。`
      : analysis.relationshipType === '名存实亡'
        ? `互动正在失去温度，沉默和低回应已经形成可观察的模式；继续加大投入，未必能换来更确定的关系。`
        : `${currentContact}愿意回应并保持一定互动，但目前更像${analysis.relationshipType}；关系有空间，确定性仍需要更多持续行动来验证。`;
  setText('narrativeConclusion', conclusion);
  setText('narrativeConclusionDetail', `${analysis.relationshipStage} · ${analysis.trend} · 目前由${leader}承担更多开启对话的节奏（${analysis.starts.me} / ${analysis.starts.them} 次）。`);

  $('overviewStats').innerHTML = [
    ['消息总量', `${analysis.total.toLocaleString()} 条`],
    ['发送结构', `${analysis.mine} / ${analysis.theirs}`],
    ['你的占比', `${myShare}%`],
    ['文本消息', `${analysis.textMessages.length} 条`],
    ['观测跨度', `${analysis.days} 天`],
    ['主动开启', `${analysis.starts.me} / ${analysis.starts.them}`],
    ['平均回复', `${compactDuration(analysis.replies.me)} / ${compactDuration(analysis.replies.them)}`],
    ['近 30 天你方占比', `${recentMyShare}%`],
  ].map(([label, value]) => `<div><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join('');
  setText('overviewSummary', `你的消息占 ${myShare}%，近 30 天上升到 ${recentMyShare}%；对话由你开启 ${analysis.starts.me} 次、${currentContact} 开启 ${analysis.starts.them} 次。平均回复为你 ${humanDuration(analysis.replies.me)}、${currentContact} ${humanDuration(analysis.replies.them)}，没有样本的方向会明确保留为空。`);

  $('diagnosisFacts').innerHTML = [
    ['关系类型', analysis.relationshipType],
    ['关系阶段', analysis.relationshipStage],
    ['关系趋势', analysis.trend],
    ['主导节奏', `${leader}更多`],
    ['情感对称性', `${analysis.symmetry} / 100`],
    ['近 30 天主动开启', `你 ${Math.round(recentStarts.me / recentTotalStarts * 100)}%`],
  ].map(([label, value]) => `<div><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join('');
  setText('diagnosisSummary', `${analysis.relationshipLabel} 目前最稳定的信号是：互动并非单方面完全自嗨，但行动投入存在不对称。${analysis.trend === '升温中' ? '后段密度提高，关系仍有升温证据。' : analysis.trend === '平稳维持' ? '整体没有明显冷却，重点在于能否从回应走向具体行动。' : '后段互动走弱，需要把最近的行为权重放高。'}`);

  setText('narrativeUserTitle', `${analysis.userStyle} · ${analysis.userAttachment.label}`);
  setText('narrativeUserCopy', `你更常通过${analysis.userLoveLanguage}表达在乎，互动中呈现${analysis.userAttachment.label}。${analysis.userAttachment.note} 核心需求更接近“${analysis.userAttachment.label.includes('焦虑') ? '被重视、被回应和获得确定性' : '清晰表达、稳定反馈和自然推进'}”。这描述的是聊天里的行为倾向，不是人格诊断。`);
  $('narrativeUserEvidence').innerHTML = quoteMarkup(userEvidence, '你的可观察锚点');
  setText('narrativePartnerTitle', `${analysis.partnerStyle} · ${analysis.partnerAttachment.label}`);
  setText('narrativePartnerCopy', `${currentContact}更常通过${analysis.partnerLoveLanguage}表达在乎，互动中呈现${analysis.partnerAttachment.label}，当前情感可得性为${analysis.availability}。对方愿意回应不等于已经确认关系；更关键的是，之后是否会主动提出并落实下一次靠近。`);
  $('narrativePartnerEvidence').innerHTML = quoteMarkup(partnerEvidence, `${currentContact}的可观察锚点`);

  const structureSummary = analysis.starts.me > analysis.starts.them && analysis.loved >= 45
    ? `记录呈现出“你发起—${currentContact}回应—你继续规划”的结构：双方有互动温度，但关系节奏主要由你推动。这个模式本身不是拒绝证据，却说明下一步应减少加码，把一部分主动权留给对方。`
    : `记录里的开启和回应相对接近，暂时没有明显单边追赶结构；接下来要看具体安排是否能持续落地，而不只是聊天当下的积极回应。`;
  setText('interactionSummary', structureSummary);
  const flow = [
    `对话开启：你 ${analysis.starts.me} 次，${currentContact} ${analysis.starts.them} 次，当前主导者是${leader}。`,
    `消息投入：你 ${analysis.mine} 条（${myShare}%），${currentContact} ${analysis.theirs} 条；近 30 天你的占比为 ${recentMyShare}%。`,
    `回应节奏：你平均 ${humanDuration(analysis.replies.me)} 回复，${currentContact} 平均 ${humanDuration(analysis.replies.them)} 回复。`,
    `连续发送：你最长连续发送 ${analysis.runs.maxMe} 条，${currentContact}最长连续发送 ${analysis.runs.maxThem} 条；这只能提示节奏，不能直接翻译成情绪。`,
    analysis.gapEvents.length ? `沉默与修复：出现 ${analysis.gapEvents.length} 次超过 24 小时的间隔，之后由你修复 ${analysis.repair.me} 次、${currentContact} 修复 ${analysis.repair.them} 次。` : '沉默与修复：当前没有超过 24 小时的长间隔样本，暂不强行解释为冷战。',
  ];
  $('interactionFlow').innerHTML = flow.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
  $('structureEvidence').innerHTML = analysis.evidence.map((item) => quoteMarkup(item.message, item.kind)).join('') || '<p class="muted">当前内容中没有足够的原话锚点。</p>';

  setText('narrativePassion', `${analysis.passion}`); setText('narrativeIntimacy', `${analysis.intimacy}`); setText('narrativeCommitment', `${analysis.commitment}`);
  setText('narrativeTriangleCopy', `当前更接近“${analysis.loveType}”：激情 ${analysis.passion}、亲密 ${analysis.intimacy}、承诺 ${analysis.commitment}。分数来自见面、情绪支持、未来规划和关键词等行为线索，不等同于爱情量表；尤其要把开放式“以后”与具体时间、地点、兑现分开看。`);

  const activeRisks = analysis.risks.filter((risk) => risk.level !== '未触发');
  $('narrativeRiskList').innerHTML = activeRisks.length ? activeRisks.map((risk) => `<li class="risk-${risk.level.includes('预警') ? 'alert' : 'watch'}"><strong>${escapeHtml(risk.type)}</strong><span>${escapeHtml(risk.level)} · ${escapeHtml(risk.note)}</span></li>`).join('') : '<li class="risk-ok"><strong>未发现高亮预警</strong><span>当前七类风险均未同时满足量化条件与原话条件。</span></li>';
  setText('narrativeRiskCopy', activeRisks.length ? `当前有 ${activeRisks.length} 项需要继续观察；单个统计信号不直接等于问题，只有模式重复且能在原话中互相印证时才升级判断。` : '没有发现高亮预警。当前更值得留意的是投入是否长期不对称，而不是把一次晚回、一次没空直接解释成拒绝。');

  const firstAdvice = analysis.strategy.start[0];
  const advice = analysis.initiative > analysis.loved + 8
    ? `你目前承担了更多规划、追问和关系维持工作。接下来把主动缩小成一次明确、低压力的邀约，发出后不连续补充解释；让${currentContact}有机会用自己的行动回答。`
    : `互动目前仍有来有往。接下来把好感落到小而具体的行动，少做试探和过度解读，观察双方是否都能稳定接住关系。`;
  setText('narrativeAdvice', advice);
  setText('narrativeScript', firstAdvice?.script || `“你方便的时候告诉我，我们再找个轻松的时间见面，不确定也没关系。”`);
  setText('narrativeBoundaryDays', `${analysis.walkAway.days} 天`);
  setText('narrativeBoundary', `${analysis.walkAway.text} 具体触发：${analysis.walkAway.trigger}。`);

  const finalConclusion = analysis.starts.them > 0 && analysis.loved >= 45
    ? `${currentContact}至少表现出友好、信任和持续相处意愿，聊天不是敷衍型关系；但目前更强的证据是“愿意保持亲近”，还不是“已经明确想进入恋爱关系”。你现在最优策略不是继续加大投入，而是稍微收一点，让对方有机会主动靠近。`
    : `${currentContact}当前的主动回应和情感投入证据有限，不能仅凭零散的积极句子推导出明确关系。先降低解释和加码，观察对方是否会主动发起、落实和修复。`;
  setText('narrativeFinal', finalConclusion);
  $('narrativeFinalEvidence').innerHTML = partnerEvidence ? quoteMarkup(partnerEvidence, `结论对应的${currentContact}原话`) : '<span>结论边界</span><p>当前内容中没有足够的对方原话，最终结论保持保守。</p>';
}

function renderDynamicNarrative(analysis) {
  const name = analysis.displayContactName || 'TA';
  const me = analysis.personProfiles.me;
  const them = analysis.personProfiles.them;
  const quoteMarkup = (message, label) => message
    ? '<div class="narrative-quote"><span>' + escapeHtml(label) + '</span><blockquote>“' + escapeHtml(message.content) + '”</blockquote><small>' + dateText(message.timestamp, true) + ' · ' + (message.sender === 'me' ? '你' : escapeHtml(name)) + '</small></div>'
    : '<div class="narrative-quote narrative-quote-empty"><span>' + escapeHtml(label) + '</span><p>当前内容中没有可引用原话。</p></div>';
  const defenseText = (profile) => profile.defenses.length
    ? '可观察的防御方式：' + profile.defenses.map((item) => item.label).join('、') + '。'
    : '当前没有足够原话识别出稳定的防御方式。';
  const userCopy = me.summary + ' 主要信号是“' + me.attachment.label + '”，核心需求更接近“' + me.need + '”，关系压力下更担心“' + me.fear + '”。' + defenseText(me) + '这描述的是本次聊天里的行为倾向，不是人格诊断。';
  const partnerCopy = them.summary + ' 主要信号是“' + them.attachment.label + '”，核心需求更接近“' + them.need + '”，关系压力下更可能担心“' + them.fear + '”。' + defenseText(them) + 'TA 的可得性为' + analysis.availability + '，仍需结合更多现实相处验证。';
  setText('narrativeConclusion', analysis.relationshipType === '深陷单恋'
    ? '当前记录里，你承担了更多开启、追问和维持关系的工作；' + name + '有回应，但主动和落地证据还不够抵消这份投入。'
    : analysis.relationshipType === '相互喜欢'
      ? '当前记录里双方都出现靠近和接话的证据，但主动推进仍有差距，暂时不能只凭聊天确认恋爱关系。'
      : analysis.relationshipType === '名存实亡'
        ? '当前记录的低回应、长等待或互动密度下降已经形成模式；继续加大投入未必会换来更确定的关系。'
        : '当前记录里' + name + '愿意保持一定互动，但更稳定的结论是“' + analysis.relationshipType + '”，确定性仍要靠持续行动验证。');
  setText('narrativeConclusionDetail', analysis.relationshipStage + ' · ' + analysis.trend + ' · 你开启 ' + analysis.starts.me + ' 次，' + name + '开启 ' + analysis.starts.them + ' 次；收尾分别为 ' + analysis.powerDynamics.endingCounts.me + ' / ' + analysis.powerDynamics.endingCounts.them + ' 次。');
  setText('overviewSummary', '你发送 ' + analysis.mine + ' 条，占全量 ' + Math.round(analysis.mine / Math.max(analysis.total, 1) * 100) + '%；' + name + '发送 ' + analysis.theirs + ' 条。你开启 ' + analysis.starts.me + ' 次对话，' + name + '开启 ' + analysis.starts.them + ' 次。当前共找到 ' + analysis.responseEvidence.samples + ' 个跨发送者回复样本，样本不足的方向已保留为空。');
  setText('diagnosisSummary', analysis.relationshipLabel + ' 当前最有解释力的不是某个标签，而是双方的投入结构：你更突出“' + me.need + '”，' + name + '更突出“' + them.need + '”。' + (analysis.turningPoint ? analysis.turningPoint.date + ' 出现互动高峰，共 ' + analysis.turningPoint.count + ' 条文字消息；它是转折候选，不自动等于关系升温。' : '当前没有足够的密度变化定位转折窗口。'));
  setText('narrativeUserTitle', me.style + ' · ' + me.attachment.label);
  setText('narrativeUserCopy', userCopy);
  $('narrativeUserEvidenceList').innerHTML = personEvidenceMarkup(me);
  setText('narrativePartnerTitle', them.style + ' · ' + them.attachment.label);
  setText('narrativePartnerCopy', partnerCopy);
  $('narrativePartnerEvidenceList').innerHTML = personEvidenceMarkup(them);
  const structureSummary = analysis.starts.me > analysis.starts.them
    ? '当前最清晰的互动结构是“你开启—' + name + '回应—你继续维持”的倾向：这不是拒绝证据，但说明关系节奏更多落在你身上。下一步应减少加码，观察对方是否自己提出并落实靠近。'
    : analysis.starts.them > analysis.starts.me
      ? name + '开启对话更多，当前主动权并不只在你手里；接下来要核对这些开启是否伴随情绪承接和具体行动，而不是只看次数。'
      : '双方开启次数相同，当前没有明显的单边追赶结构；下一步重点是比较谁会把回应变成具体安排、谁会在沉默后回来。';
  setText('interactionSummary', structureSummary);
  const recent = analysis.valid.filter((message) => message.timestamp >= analysis.last - 30 * 86400);
  const flow = [
    '开启：你 ' + analysis.starts.me + ' 次，' + name + ' ' + analysis.starts.them + ' 次；主导节奏暂时由' + analysis.powerDynamics.leader + '承担。',
    '投入：你 ' + analysis.mine + ' 条、' + name + ' ' + analysis.theirs + ' 条；近 30 天你方占比为 ' + Math.round(recent.filter((message) => message.sender === 'me').length / Math.max(recent.length, 1) * 100) + '%。',
    analysis.responseEvidence.samples ? '回复：共 ' + analysis.responseEvidence.samples + ' 个跨发送者样本；最慢一次等待 ' + humanDuration(analysis.responseEvidence.slowest.gap) + '，最快一次 ' + humanDuration(analysis.responseEvidence.fastest.gap) + '。' : '回复：当前没有足够的跨发送者样本，不能把空白解释成冷淡。',
    analysis.turningPoint ? '窗口：' + analysis.turningPoint.date + ' 形成 ' + analysis.turningPoint.count + ' 条文字消息的互动高峰，现场原话是“' + analysis.turningPoint.message.content + '”。' : '窗口：当前没有可定位的互动高峰原话。',
    analysis.gapEvents.length ? '沉默与修复：超过 24 小时的间隔有 ' + analysis.gapEvents.length + ' 次；你重启 ' + analysis.repair.me + ' 次，' + name + '重启 ' + analysis.repair.them + ' 次，确认有后续跟进的为 ' + analysis.repairSuccess + ' 次。' : '沉默与修复：没有超过 24 小时的长间隔样本，暂不强行解释为冷战。',
  ];
  $('interactionFlow').innerHTML = flow.map((item) => '<li>' + escapeHtml(item) + '</li>').join('');
  $('structureEvidence').innerHTML = analysis.evidence.map((item) => quoteMarkup(item.message, item.kind)).join('') || '<p class="muted">当前内容中没有足够的原话锚点。</p>';
  const triangleEvidence = analysis.triangleEvidence;
  setText('narrativeTriangleCopy', '当前更接近“' + analysis.loveType + '”：激情 ' + analysis.passion + '、亲密 ' + analysis.intimacy + '、承诺 ' + analysis.commitment + '。激情证据' + (triangleEvidence.passion.length ? '包括“' + triangleEvidence.passion[0].content + '”' : '不足') + '；亲密证据' + (triangleEvidence.intimacy.length ? '包括“' + triangleEvidence.intimacy[0].content + '”' : '不足') + '；承诺证据' + (triangleEvidence.commitment.length ? '包括“' + triangleEvidence.commitment[0].content + '”' : '不足') + '。分数只表示当前可观察信号，不等同于爱情量表。');
  const activeRisks = analysis.risks.filter((risk) => risk.level !== '未触发');
  setText('narrativeRiskCopy', activeRisks.length
    ? '当前有 ' + activeRisks.length + ' 项观察提示；它们只在量化条件和原话条件同时成立时升级，不能用一次晚回或一句“忙”单独定性。'
    : '当前没有满足“双重门槛”的高亮预警。更值得继续观察的是投入是否长期不对称，以及具体安排是否兑现。');
  const advice = analysis.initiative > analysis.loved + 8
    ? '你目前承担了更多关系维持工作。结合“' + me.need + '”这一侧信号，下一步把主动缩小成一次清晰、低压力的请求，发出后不连续补充解释，让' + name + '用行动回答。'
    : '当前互动没有呈现明显单边追赶。下一步把积极回应落到时间、地点和后续动作，同时少做试探，观察双方是否都能稳定接住关系。';
  setText('narrativeAdvice', advice);
  setText('narrativeScript', analysis.strategy.start[0]?.script || '“你方便的时候告诉我，我们找个轻松的时间见面；不确定也没关系。”');
  setText('narrativeBoundaryDays', analysis.walkAway.days + ' 天');
  setText('narrativeBoundary', analysis.walkAway.text + ' 具体触发：' + analysis.walkAway.trigger + '。');
  setText('narrativeFinal', '综合当前 ' + analysis.total + ' 条可识别记录：你与' + name + '的关系更接近“' + analysis.relationshipType + ' / ' + analysis.relationshipStage + '”。' + me.summary + ' ' + name + '方面的关键验证点是“' + them.need + '”能否通过主动、兑现和修复表现出来。最稳妥的做法是降低解释和加码，给对方一个真实的主动窗口。');
  $('narrativeFinalEvidence').innerHTML = them.anchor ? quoteMarkup(them.anchor, '结论对应的' + name + '原话') : '<span>结论边界</span><p>当前内容中没有足够的对方原话，最终结论保持保守。</p>';
}

const baseRenderNarrative = renderNarrative;
renderNarrative = (analysis) => {
  baseRenderNarrative(analysis);
  renderDynamicNarrative(analysis);
};

function render(analysis) {
  $('report')?.classList.remove('is-invalid');
  setText('reportTitle', '这段关系的现场');
  renderNarrative(analysis);
  latestAnalysis = analysis; setText('contactName', currentContact); setText('avatar', initials(currentContact)); setText('dateRange', `${dateText(analysis.first)} — ${dateText(analysis.last)}`); setText('scopeLabel', `${analysis.total.toLocaleString()} 条记录 · ${analysis.days} 天`); const verdict = analysis.relationshipType === '相互喜欢' ? '这段关系有互相靠近的证据。' : analysis.relationshipType === '深陷单恋' ? '你在用力维持，TA 的回应还不够稳定。' : analysis.relationshipType === '名存实亡' ? '互动正在失去温度，沉默本身也是信息。' : '回应有来有往，但关系还需要更多具体行动。'; setText('verdict', verdict); setText('verdictDetail', `${analysis.relationshipLabel} 这不是爱的判决，而是当前记录里最稳定的行为信号。`); setText('symmetryScore', analysis.symmetry); $('scoreOrb').style.setProperty('--score', `${analysis.symmetry * 3.6}deg`); $('scoreOrb').setAttribute('aria-label', `关系对称度 ${analysis.symmetry} 分`);
  setText('initiativeScore', analysis.initiative); setText('lovedScore', analysis.loved); setText('coldScore', analysis.coldIndex); $('initiativeMeter').style.width = `${analysis.initiative}%`; $('lovedMeter').style.width = `${analysis.loved}%`; $('coldMeter').style.width = `${analysis.coldIndex}%`; setText('initiativeNote', `你发起了 ${Math.round(analysis.starts.me / Math.max(analysis.starts.me + analysis.starts.them, 1) * 100)}% 的对话，平均回复 ${humanDuration(analysis.replies.me)}。`); setText('lovedNote', `TA 开启了 ${analysis.starts.them} 次对话，平均回复 ${humanDuration(analysis.replies.them)}。`); setText('coldNote', analysis.coldIndex >= 60 ? '短回复或长等待已经形成了值得正视的模式。' : '短回复与长等待暂时没有形成压倒性模式。');
  setText('messageCount', analysis.total.toLocaleString()); setText('startCount', `${analysis.starts.me} / ${analysis.starts.them}`); setText('replyTime', `${compactDuration(analysis.replies.me)} / ${compactDuration(analysis.replies.them)}`); setText('repairCount', `${analysis.repair.me} / ${analysis.repair.them}`); setText('trendStart', analysis.dailyTrend[0]?.label.slice(5) || '—'); setText('trendEnd', analysis.dailyTrend.at(-1)?.label.slice(5) || '—'); const trendMax = Math.max(...analysis.dailyTrend.map((item) => item.count), 1); $('trendChart').innerHTML = analysis.dailyTrend.map((item, index) => `<div class="trend-bar" style="height:${Math.max(7, item.count / trendMax * 100)}%; animation-delay:${Math.min(index * 15, 400)}ms" data-label="${escapeHtml(item.label.slice(5))} · ${item.count} 条"></div>`).join('');
  setText('relationshipType', analysis.relationshipType); setText('relationshipLabel', analysis.relationshipLabel); setText('relationshipStage', analysis.relationshipStage); setText('stageDescription', analysis.stageDescription); setText('relationshipTrend', analysis.trend); setText('trendDescription', analysis.trend === '升温中' ? '后段互动密度高于前段，靠近正在增加。' : analysis.trend === '逐渐降温' || analysis.trend === '已经凉透' ? '后段互动密度和情绪回应低于前段。' : '最近的消息密度与情绪表达暂时稳定。'); setText('gottmanRatio', analysis.gottmanRatio); setText('gottmanNote', analysis.horsemen.length ? `观察到：${analysis.horsemen.join('、')}。` : '暂未发现明显四骑士原话模式。');
  setText('loveType', analysis.loveType); setText('passionScore', analysis.passion); setText('intimacyScore', analysis.intimacy); setText('commitmentScore', analysis.commitment); setText('triangleNote', `激情 ${analysis.passion} / 亲密 ${analysis.intimacy} / 承诺 ${analysis.commitment}；分数来自关键词和行为信号，不等同于爱情量表。`); setText('weCount', analysis.weCount.me + analysis.weCount.them); setText('futureCount', analysis.futureCountTotal); const positiveTotal = Object.values(analysis.positive).reduce((sum, value) => sum + value, 0); const negativeTotal = Object.values(analysis.negative).reduce((sum, value) => sum + value, 0); setText('positiveCount', positiveTotal); setText('negativeCount', negativeTotal); setText('languageFinding', analysis.languageFinding); $('positiveBar').style.width = `${positiveTotal / Math.max(positiveTotal + negativeTotal, 1) * 100}%`; $('negativeBar').style.width = `${negativeTotal / Math.max(positiveTotal + negativeTotal, 1) * 100}%`;
  setText('userStyle', analysis.userStyle); setText('userAttachment', analysis.userAttachment.label); setText('userLoveLanguage', analysis.userLoveLanguage); setText('userNeed', analysis.userAttachment.label.includes('焦虑') ? '确定性与被回应' : '清晰表达与稳定反馈'); setText('userPortraitCopy', `${analysis.userAttachment.note} 这是一种行为倾向描述，不是人格诊断。`); $('userPortraitEvidence').textContent = analysis.evidence.find((item) => item.message.sender === 'me') ? `锚点：${analysis.evidence.find((item) => item.message.sender === 'me').message.content}` : '当前缺少足够的我方原话锚点。'; setText('partnerStyle', analysis.partnerStyle); setText('partnerAttachment', analysis.partnerAttachment.label); setText('partnerLoveLanguage', analysis.partnerLoveLanguage); setText('availability', analysis.availability); setText('partnerPortraitCopy', `${analysis.partnerAttachment.note} TA 的情感可得性为${analysis.availability}，仍需结合更多真实相处验证。`); $('partnerPortraitEvidence').textContent = analysis.evidence.find((item) => item.message.sender === 'them') ? `锚点：${analysis.evidence.find((item) => item.message.sender === 'them').message.content}` : '当前缺少足够的 TA 原话锚点。';
  setText('evidenceCount', `${String(analysis.evidence.length).padStart(2, '0')} 条锚点`); $('evidenceList').innerHTML = analysis.evidence.map((item, index) => `<div class="evidence-item"><div class="evidence-number">0${index + 1}</div><div><div class="evidence-meta"><span class="evidence-kind">${escapeHtml(item.kind)}</span><span>${dateText(item.message.timestamp, true)}</span></div><p class="evidence-quote">${escapeHtml(item.message.content)}</p><div class="evidence-meta"><span>${item.message.sender === 'me' ? '你' : escapeHtml(currentContact)} · ${escapeHtml(item.note)}</span></div></div></div>`).join('') || '<p class="muted">当前数据不足以留下证据锚点。</p>';
  const profile = [{ label: '一起 / 我们', value: analysis.weCount.me + analysis.weCount.them }, { label: '正向表达', value: positiveTotal }, { label: '情绪摩擦', value: negativeTotal }, { label: '模糊保留', value: analysis.hedging.me + analysis.hedging.them }]; const profileMax = Math.max(...profile.map((item) => item.value), 1); $('profileBars').innerHTML = profile.map((item) => `<div class="profile-row"><label>${item.label}</label><div class="profile-track"><i style="width:${Math.max(5, item.value / profileMax * 100)}%"></i></div><strong>${item.value}</strong></div>`).join('');
  const triggeredRisks = analysis.risks.filter((risk) => risk.level !== '未触发'); setText('riskCount', `${triggeredRisks.length} 项`); $('riskList').innerHTML = analysis.risks.map((risk) => `<div class="risk-item"><strong>${escapeHtml(risk.type)}</strong><p>${escapeHtml(risk.level === '未触发' ? '当前没有同时满足两类条件。' : risk.note)}</p><span class="risk-status ${risk.level === '观察提示' ? 'watch' : risk.level.includes('预警') ? 'alert' : ''}">${escapeHtml(risk.level)}</span></div>`).join(''); setText('repairMe', analysis.repair.me); setText('repairThem', analysis.repair.them); setText('repairCopy', analysis.gapEvents.length ? `共识别 ${analysis.gapEvents.length} 次超过 24 小时的沉默；修复并不自动等于问题解决，但能看见谁在让关系重新启动。` : '还没有足够的长间隔样本，先不要急着给谁贴标签。'); document.querySelectorAll('#horsemen span').forEach((element) => element.classList.toggle('active', analysis.horsemen.includes(element.textContent)));
  $('stopList').innerHTML = analysis.strategy.stop.map((item) => `<div class="strategy-item"><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.reason)} 原话：${escapeHtml(item.quote)}</span></div>`).join(''); $('startList').innerHTML = analysis.strategy.start.map((item) => `<div class="strategy-item"><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.reason)} 参考：${escapeHtml(item.script)}</span></div>`).join(''); setText('walkAwayTime', analysis.walkAway.days); setText('walkAwayText', analysis.walkAway.text); setText('walkAwayTrigger', analysis.walkAway.trigger); $('findingsList').innerHTML = analysis.findings.map((finding, index) => `<article class="finding-item"><b>0${index + 1}</b><h4>${escapeHtml(finding.title)}</h4>${finding.quote ? `<blockquote>“${escapeHtml(finding.quote.content)}”<br /><small>${dateText(finding.quote.timestamp, true)} · ${finding.quote.sender === 'me' ? '你' : escapeHtml(currentContact)}</small></blockquote>` : '<blockquote>证据不足，保留空白。</blockquote>'}<p>${escapeHtml(finding.text)}</p></article>`).join(''); setText('nextStepText', analysis.walkAway.text);
}

function renderDynamicPortraitCards(analysis) {
  const name = analysis.displayContactName || 'TA';
  const me = analysis.personProfiles.me;
  const them = analysis.personProfiles.them;
  setText('contactName', name);
  setText('avatar', initials(name));
  setText('userStyle', me.style);
  setText('userAttachment', me.attachment.label);
  setText('userLoveLanguage', analysis.userLoveLanguage);
  setText('userNeed', me.need);
  setText('userPortraitCopy', me.summary + ' 核心需求：' + me.need + '；主要担心：' + me.fear + '。' + (me.defenses.length ? '当前可见防御：' + me.defenses.map((item) => item.label).join('、') + '。' : '当前没有足够原话识别防御模式。'));
  $('userPortraitEvidence').textContent = me.anchor ? '锚点：' + me.anchor.content : '当前缺少足够的我方原话锚点。';
  $('userPortraitEvidenceList').innerHTML = personEvidenceMarkup(me);
  setText('partnerStyle', them.style);
  setText('partnerAttachment', them.attachment.label);
  setText('partnerLoveLanguage', analysis.partnerLoveLanguage);
  setText('availability', analysis.availability);
  setText('partnerPortraitCopy', them.summary + ' 核心需求：' + them.need + '；主要担心：' + them.fear + '。' + (them.defenses.length ? '当前可见防御：' + them.defenses.map((item) => item.label).join('、') + '。' : '当前没有足够原话识别防御模式。'));
  $('partnerPortraitEvidence').textContent = them.anchor ? '锚点：' + them.anchor.content : '当前缺少足够的 TA 原话锚点。';
  $('partnerPortraitEvidenceList').innerHTML = personEvidenceMarkup(them);
}

function renderRelationshipRecognition(analysis) {
  const relation = analysis.relationship || classifyRelationship(analysis);
  const name = analysis.displayContactName || currentContact || 'TA';
  const romantic = relation.isRomantic;
  const confidenceText = relation.confidence ? relation.confidence + '置信度' : '等待数据';
  const relationSummary = relation.runnerUp && relation.confidence !== '高'
    ? relation.summary + ' 另外捕捉到“' + relation.runnerUp + '”的次级信号，因此这里只给出倾向，不把它当成确定身份。'
    : relation.summary;
  setText('relationshipDomain', relation.type);
  setText('relationshipConfidence', confidenceText);
  setText('relationshipConfidenceBadge', confidenceText);
  setText('relationshipRecognitionSummary', relationSummary);
  const signalItems = relation.signals.length
    ? relation.signals.map((signal) => '<li><strong>' + escapeHtml(signal.label) + '</strong><span>' + signal.count + ' 条</span></li>').join('')
    : '<li class="relationship-signal-empty"><strong>证据边界</strong><span>没有捕捉到稳定的关系称谓或场景信号，暂不强行归类。</span></li>';
  const evidenceItems = relation.evidence.map((message) => '<li class="relationship-signal-quote"><strong>原文锚点</strong><span>“' + escapeHtml(message.content) + '” · ' + (message.sender === 'me' ? '你' : escapeHtml(name)) + '</span></li>').join('');
  $('relationshipSignalList').innerHTML = signalItems + evidenceItems;
  setText('diagnosisSummary', relationSummary + (romantic
    ? ' 后续恋爱维度只用于拆分激情、亲密与承诺，不能替代关系确认。'
    : ' 后续报告将按这一关系解释互动质量，不会把“喜欢”“想念”或高频聊天自动翻译成恋爱。'));

  const topVerdict = romantic
    ? analysis.relationshipType === '相互喜欢' ? '这段关系有互相靠近的证据。' : analysis.relationshipType === '深陷单恋' ? '你在用力维持，TA 的回应还不够稳定。' : analysis.relationshipType === '名存实亡' ? '互动正在失去温度，沉默本身也是信息。' : '回应有来有往，但关系还需要更多具体行动。'
    : '先按“' + relation.type + '”读取这段互动。';
  setText('verdict', topVerdict);
  setText('verdictDetail', relationSummary + ' 当前识别为' + confidenceText + '，这不是对现实关系的绝对判定。');
  setText('narrativeConclusion', romantic
    ? analysis.relationshipType === '深陷单恋' ? '当前记录里，你承担了更多开启、追问和维持关系的工作；' + name + '有回应，但主动和落地证据还不够抵消这份投入。'
      : analysis.relationshipType === '相互喜欢' ? '当前记录里双方都出现靠近和接话的证据，但主动推进仍有差距，暂时不能只凭聊天确认恋爱关系。'
        : analysis.relationshipType === '名存实亡' ? '当前记录的低回应、长等待或互动密度下降已经形成模式；继续加大投入未必会换来更确定的关系。'
          : '当前记录里' + name + '愿意保持一定互动，但更稳定的结论是“' + analysis.relationshipType + '”，确定性仍要靠持续行动验证。'
    : relationSummary);
  setText('narrativeConclusionDetail', relation.type + ' · ' + analysis.relationshipStage + ' · ' + confidenceText + '；你开启 ' + analysis.starts.me + ' 次，' + name + '开启 ' + analysis.starts.them + ' 次。');
  setText('triangleKicker', romantic ? '关系成分' : '互动维度参考');
  setText('triangleTitle', romantic ? 'Sternberg 三角' : '亲密与承诺参考');
  setText('narrativeTriangleKicker', romantic ? '关系成分' : '互动维度参考');
  setText('narrativeTriangleTitle', romantic ? 'Sternberg 三角' : '亲密与承诺参考');
  setText('loveType', romantic ? analysis.loveType : '不作为恋爱判定');
  setText('triangleNote', romantic
    ? '激情 ' + analysis.passion + ' / 亲密 ' + analysis.intimacy + ' / 承诺 ' + analysis.commitment + '；分数来自关键词和行为信号，不等同于爱情量表。'
    : '当前关系更接近“' + relation.type + '”。激情、亲密和承诺分数只作为互动维度参考，不用于把亲情、友情或事务关系解释成恋爱。');
  setText('narrativeTriangleCopy', romantic
    ? '当前更接近“' + analysis.loveType + '”：激情 ' + analysis.passion + '、亲密 ' + analysis.intimacy + '、承诺 ' + analysis.commitment + '。分数只表示当前可观察信号，不等同于爱情量表；还要把开放式表达与具体行动分开看。'
    : '这部分不作为恋爱结论。当前关系更接近“' + relation.type + '”，激情 ' + analysis.passion + '、亲密 ' + analysis.intimacy + '、承诺 ' + analysis.commitment + ' 仅帮助观察陪伴、信任和持续投入，不能改变前面的关系识别。');
  setText('userLanguageLabel', romantic ? '爱的语言' : '表达方式');
  setText('partnerLanguageLabel', romantic ? '爱的语言' : '表达方式');
  $('trianglePanel')?.classList.toggle('contextual-triangle', !romantic);
  const visibleRisks = romantic ? analysis.risks : analysis.risks.filter((risk) => !ROMANTIC_RISK_TYPES.has(risk.type));
  const triggeredRisks = visibleRisks.filter((risk) => risk.level !== '未触发');
  setText('riskCount', triggeredRisks.length + ' 项');
  $('riskList').innerHTML = visibleRisks.map((risk) => '<div class="risk-item"><strong>' + escapeHtml(risk.type) + '</strong><p>' + escapeHtml(risk.level === '未触发' ? '当前没有同时满足两类条件。' : risk.note) + '</p><span class="risk-status ' + (risk.level === '观察提示' ? 'watch' : risk.level.includes('预警') ? 'alert' : '') + '">' + escapeHtml(risk.level) + '</span></div>').join('');
  setText('narrativeRiskCopy', triggeredRisks.length
    ? '当前有 ' + triggeredRisks.length + ' 项需要继续观察；单个统计信号不直接等于问题，只有模式重复且能在原话中互相印证时才升级判断。'
    : romantic ? '没有发现高亮预警。当前更值得留意的是投入是否长期不对称，而不是把一次晚回、一次没空直接解释成拒绝。'
      : '当前关系识别为“' + relation.type + '”，未加载只适用于恋爱语境的风险标签；后续只观察回应、边界、兑现和修复。');

  const guidance = relation.domain === 'family'
    ? { advice: '按家人关系看，下一步重点不是确认爱意，而是看双方是否在重要时刻持续回应、照料和尊重边界。', script: '“最近还好吗？有需要我帮忙的地方直接告诉我。”', boundary: '连续几次只有单向询问或事务往来时，先调整联系频率，不用一次沉默否定亲情。', trigger: '连续多次只有单向照料，且没有回应或修复' }
    : relation.domain === 'work' || relation.domain === 'collaboration'
      ? { advice: '按工作或合作关系看，优先核对职责、时间、交付和反馈，不把及时回复或客气表达解释成私人亲密。', script: '“为了方便推进，我把时间、负责人和下一步整理成三点，你确认一下。”', boundary: '边界应落在任务和沟通窗口：需求不清或反复延期时，留下书面确认并减少无效追问。', trigger: '连续两次没有明确反馈、交付或责任确认' }
      : relation.domain === 'hierarchy'
        ? { advice: '按师生或上下级关系看，重点是指导质量、反馈方式和职责边界；保持专业距离比猜测情感更重要。', script: '“我把目前的问题和需要确认的两点列出来，方便您/你有空时反馈。”', boundary: '把私人期待与角色责任分开，遇到模糊要求时用明确问题和记录保护自己的空间。', trigger: '连续多次缺少明确反馈，且角色边界开始模糊' }
        : relation.domain === 'classmate' || relation.domain === 'friendship'
          ? { advice: '按朋友或校园关系看，观察共同活动、互相支持和自然出现的频率；不用把一次热闹或一次晚回升级成关系证明。', script: '“你下次有空我们再一起吃饭/玩，不方便就改天。”', boundary: '保留自己的生活节奏，连续几次只有你发起时，就把投入调回双方都舒服的水平。', trigger: '连续两三次只有你发起，且对方不提出替代安排' }
          : romantic
            ? { advice: analysis.initiative > analysis.loved + 8 ? '你目前承担了更多关系维持工作。把主动缩小成一次清晰、低压力的请求，发出后不连续补充解释。' : '当前互动没有呈现明显单边追赶。把积极回应落到时间、地点和后续动作，同时少做试探。', script: analysis.strategy.start[0]?.script || '“你方便的时候告诉我，我们找个轻松的时间见面；不确定也没关系。”', boundary: '保留一个自然反馈窗口，观察对方是否会主动发起、落实和修复。', trigger: '给出一次明确请求后，连续两周没有稳定回应、主动和修复' }
            : { advice: '关系身份还缺少足够证据。先继续收集真实互动，不急着把称呼、频率或某句暧昧话解释成结论。', script: '“有空再聊，我先去忙自己的事。”', boundary: '在关系未确认前，不用追加过多投入，也不要用一次互动测试对方。', trigger: '新增多次可识别互动后仍无法区分关系场景' };
  setText('narrativeAdvice', guidance.advice);
  setText('narrativeScript', guidance.script);
  setText('narrativeBoundary', guidance.boundary);
  setText('walkAwayText', guidance.boundary);
  setText('walkAwayTrigger', guidance.trigger);
  setText('nextStepText', guidance.advice);
  setText('riskFootnote', romantic
    ? '只有“量化条件 + 原话条件”同时满足，才会升级为高亮预警；单独出现的统计信号仅列为观察项。'
    : '关系类型不同，风险标签也不同；当前已移除只适用于恋爱语境的标签，只保留可观察的回应、边界和修复模式。');
  const stopItems = romantic
    ? analysis.strategy.stop
    : [{ title: '停止用单次事件解释全部关系', reason: '先看多次互动的回应、边界和修复模式，再决定是否调整投入。', quote: analysis.textMessages.at(-1)?.content || '当前没有足够原话' }];
  const startItems = romantic
    ? analysis.strategy.start
    : [{ title: '把沟通落到关系场景', reason: relation.domain === 'work' || relation.domain === 'collaboration' ? '明确责任、时间和下一步，减少模糊往返。' : '用自然、低压力的方式观察双方是否愿意持续出现。', script: guidance.script }];
  $('stopList').innerHTML = stopItems.map((item) => '<div class="strategy-item"><strong>' + escapeHtml(item.title) + '</strong><span>' + escapeHtml(item.reason) + ' 原话：' + escapeHtml(item.quote || '当前没有足够原话') + '</span></div>').join('');
  $('startList').innerHTML = startItems.map((item) => '<div class="strategy-item"><strong>' + escapeHtml(item.title) + '</strong><span>' + escapeHtml(item.reason) + ' 参考：' + escapeHtml(item.script || guidance.script) + '</span></div>').join('');
  setText('narrativeFinal', romantic
    ? '综合当前 ' + analysis.total + ' 条可识别记录：你与' + name + '的关系更接近“' + analysis.relationshipType + ' / ' + analysis.relationshipStage + '”。更稳妥的做法是把确定性交给持续行动，而不是继续用单句聊天加码解释。'
    : '综合当前 ' + analysis.total + ' 条可识别记录：你与' + name + '的关系首先应按“' + relation.type + ' / ' + analysis.relationshipStage + '”理解。当前证据支持的是这一关系场景下的互动模式，不能跨场景推导出恋爱结论；后续看回应、边界、兑现和修复是否持续。');
}

const baseRender = render;
render = (analysis) => {
  baseRender(analysis);
  renderDynamicPortraitCards(analysis);
  renderRelationshipRecognition(analysis);
};

function updateStatus(message, error = false) { $('importStatus').classList.toggle('is-error', error); $('importStatus').innerHTML = '<span class="status-led"></span>' + escapeHtml(message); }
function hideIdentityDetection() { const panel = $('identityDetection'); if (panel) panel.hidden = true; const choices = $('identityChoices'); if (choices) choices.innerHTML = ''; }
function showIdentityDetection(info = {}) {
  const panel = $('identityDetection'); if (!panel) return;
  const candidates = info.candidates || []; const myInput = $('myIdentity'); const contactInput = $('contactIdentity');
  if (info.myLabel && myInput && !myInput.value.trim()) markIdentityInput(myInput, info.myLabel, 'detected');
  if (info.contactLabel && contactInput && !contactInput.value.trim()) markIdentityInput(contactInput, info.contactLabel, 'detected');
  const title = $('identityDetectionTitle'); const note = $('identityDetectionNote'); const choices = $('identityChoices');
  if (info.myLabel && info.contactLabel) { panel.hidden = false; setText('identityDetectionTitle', `已自动识别：你 = ${info.myLabel} · TA = ${info.contactLabel}`); setText('identityDetectionNote', info.directionKnown ? '已根据发送方向字段和昵称映射完成判断。' : '已根据你提供的本人标识完成判断。'); if (choices) choices.innerHTML = ''; return; }
  if (candidates.length >= 2) { panel.hidden = false; setText('identityDetectionTitle', '已找到双方昵称，但缺少“本人”标记'); setText('identityDetectionNote', '请选择哪个昵称是你。选择后会立即重新分析，不会把另一方猜成 TA。'); if (choices) { choices.innerHTML = candidates.slice(0, 8).map((candidate) => `<button class="identity-choice" type="button" data-identity-choice="${escapeHtml(candidate)}">${escapeHtml(candidate)} 是我</button>`).join(''); choices.querySelectorAll('[data-identity-choice]').forEach((button) => button.addEventListener('click', () => chooseIdentity(button.getAttribute('data-identity-choice')))); } return; }
  if (info.directionKnown) { panel.hidden = false; setText('identityDetectionTitle', '已根据发送方向字段自动判断'); setText('identityDetectionNote', '当前记录没有足够的昵称字段可展示，但消息方向已经完成识别。'); if (choices) choices.innerHTML = ''; return; }
  hideIdentityDetection();
}
function chooseIdentity(label) { if (!label || !pendingImport) return; $('myIdentity').value = label; const pending = pendingImport; invalidateReport(); updateStatus(`正在使用“${label}”作为本人昵称重新识别…`); try { const messages = parsePayload(pending.rawText, pending.filename); currentMessages = messages; runAnalysis(messages, pending.filename || '粘贴内容'); } catch (error) { showIdentityDetection(lastImportInfo); updateStatus(error.message, true); } }
function invalidateReport() { latestAnalysis = null; currentMessages = []; currentContact = 'TA'; currentSourceLabel = '未载入'; $('report')?.classList.add('is-invalid'); ['findingsList', 'evidenceList', 'riskList', 'profileBars', 'trendChart', 'stopList', 'startList', 'narrativeUserEvidenceList', 'narrativePartnerEvidenceList', 'userPortraitEvidenceList', 'partnerPortraitEvidenceList'].forEach((id) => { const element = $(id); if (element) element.innerHTML = ''; }); setText('scopeLabel', '等待有效数据'); setText('reportTitle', '等待有效聊天记录'); setText('contactName', '未载入'); setText('avatar', '—'); setText('dateRange', '请导入可识别的聊天内容'); hideIdentityDetection(); }
function resetRelationshipRecognition() { setText('relationshipDomain', '待识别'); setText('relationshipConfidence', '等待数据'); setText('relationshipConfidenceBadge', '—'); setText('relationshipRecognitionSummary', '导入聊天记录后，先根据关系称谓、身份和场景信号判断关系类型，再决定是否进入恋爱维度分析。'); const signalList = $('relationshipSignalList'); if (signalList) signalList.innerHTML = ''; $('trianglePanel')?.classList.remove('contextual-triangle'); setText('triangleKicker', '关系成分'); setText('triangleTitle', 'Sternberg 三角'); setText('narrativeTriangleKicker', '关系成分'); setText('narrativeTriangleTitle', 'Sternberg 三角'); setText('loveType', '浪漫之爱'); setText('riskFootnote', '只有“量化条件 + 原话条件”同时满足，才会升级为高亮预警；单独出现的统计信号仅列为观察项。'); }
const clearReportBeforeImport = invalidateReport;
invalidateReport = () => { clearReportBeforeImport(); resetRelationshipRecognition(); };
function runAnalysis(messages, label = '本地导入') { try { const analysis = analyze(messages); currentSourceLabel = label; render(analysis); showIdentityDetection(lastImportInfo); setText('scopeLabel', `${label} · ${analysis.total.toLocaleString()} 条记录 · ${analysis.days} 天`); const unknownNote = lastImportInfo.unknown ? ` · ${lastImportInfo.unknown} 条未识别发送方向已忽略` : ''; updateStatus(`${label} · 已完成多维本地观测${unknownNote}`); $('report').scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (error) { invalidateReport(); showIdentityDetection(lastImportInfo); updateStatus(error.message, true); } }
function downloadSummary() { if (!latestAnalysis) return; const analysis = latestAnalysis; const lines = [`心动证据局 / ${currentContact}`, `观测区间：${dateText(analysis.first)} — ${dateText(analysis.last)}`, `消息量：${analysis.total} 条`, '', `关系类型：${analysis.relationshipType}`, `关系阶段：${analysis.relationshipStage}`, `关系趋势：${analysis.trend}`, `关系对称度：${analysis.symmetry}/100`, `主动投入：${analysis.initiative}/100`, `被回应感：${analysis.loved}/100`, `冷淡信号：${analysis.coldIndex}/100`, `平均回复：你 ${humanDuration(analysis.replies.me)} / TA ${humanDuration(analysis.replies.them)}`, `Sternberg：激情 ${analysis.passion} / 亲密 ${analysis.intimacy} / 承诺 ${analysis.commitment}`, `Gottman 正负比：${analysis.gottmanRatio}`, '', '一句话读局：', $('verdict').textContent, '', '五个发现：', ...analysis.findings.map((finding, index) => `${index + 1}. ${finding.title}：${finding.text}${finding.quote ? ` 原话：“${finding.quote.content}”` : ''}`), '', '风险观察：', ...analysis.risks.filter((risk) => risk.level !== '未触发').map((risk) => `- ${risk.type} / ${risk.level}：${risk.note}`), '', '说明：这是基于聊天记录的统计观察，不构成心理诊断或关系结论。']; const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' }); const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = `心动证据局-${currentContact}-摘要.txt`; anchor.click(); URL.revokeObjectURL(url); }
downloadSummary = function () { if (!latestAnalysis) return; const analysis = latestAnalysis; const relation = analysis.relationship || { type: '关系待确认', confidence: '低', summary: '关系识别证据不足。' }; const visibleRisks = relation.isRomantic ? analysis.risks : analysis.risks.filter((risk) => !ROMANTIC_RISK_TYPES.has(risk.type)); const lines = [`心动证据局 / ${currentContact}`, `观测区间：${dateText(analysis.first)} — ${dateText(analysis.last)}`, `消息量：${analysis.total} 条`, '', `初步关系识别：${relation.type}`, `识别置信度：${relation.confidence}`, `识别依据：${relation.summary}`, `关系类型：${analysis.relationshipType}`, `关系阶段：${analysis.relationshipStage}`, `关系趋势：${analysis.trend}`, `关系对称度：${analysis.symmetry}/100`, `主动投入：${analysis.initiative}/100`, `被回应感：${analysis.loved}/100`, `冷淡信号：${analysis.coldIndex}/100`, `平均回复：你 ${humanDuration(analysis.replies.me)} / TA ${humanDuration(analysis.replies.them)}`, `Sternberg：激情 ${analysis.passion} / 亲密 ${analysis.intimacy} / 承诺 ${analysis.commitment}`, `Gottman 正负比：${analysis.gottmanRatio}`, '', '一句话读局：', $('verdict').textContent, '', '五个发现：', ...analysis.findings.map((finding, index) => `${index + 1}. ${finding.title}：${finding.text}${finding.quote ? ` 原话：“${finding.quote.content}”` : ''}`), '', '风险观察：', ...visibleRisks.filter((risk) => risk.level !== '未触发').map((risk) => `- ${risk.type} / ${risk.level}：${risk.note}`), '', '说明：这是基于聊天记录的统计观察，不构成心理诊断或关系结论。']; const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' }); const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = `心动证据局-${currentContact}-摘要.txt`; anchor.click(); URL.revokeObjectURL(url); };

$('analyzeButton').addEventListener('click', () => { const text = $('textInput').value.trim(); if (!text) { if (currentMessages.length && currentSourceLabel !== '未载入' && currentSourceLabel !== '示例样本') return runAnalysis(currentMessages, currentSourceLabel); invalidateReport(); updateStatus('请先粘贴或选择聊天记录；如需查看演示，请点击“载入示例”。', true); return; } invalidateReport(); updateStatus('正在读取粘贴内容…'); try { const messages = parsePayload(text); currentMessages = messages; runAnalysis(messages, '粘贴内容'); } catch (error) { invalidateReport(); showIdentityDetection(lastImportInfo); updateStatus(error.message, true); } });
$('demoButton').addEventListener('click', () => { currentContact = 'TA'; $('textInput').value = ''; currentMessages = sampleMessages.map(([time, sender, content], index) => ({ timestamp: new Date(`${time.replace(' ', 'T')}:00`).getTime() / 1000, sender, content, type: 'text', local_id: index + 1 })); lastImportInfo = { unknown: 0, total: currentMessages.length }; runAnalysis(currentMessages, '示例样本'); });
$('downloadButton').addEventListener('click', downloadSummary);
function readFile(file) { const revision = prepareNewImport({ clearText: true }); invalidateReport(); updateStatus(`正在读取 ${file.name}…`); const reader = new FileReader(); reader.onload = () => { if (revision !== importRevision) return; try { const messages = parsePayload(String(reader.result), file.name); currentMessages = messages; runAnalysis(messages, file.name); } catch (error) { invalidateReport(); showIdentityDetection(lastImportInfo); updateStatus(error.message, true); } }; reader.onerror = () => { if (revision !== importRevision) return; invalidateReport(); updateStatus(`读取 ${file.name} 失败，请重新选择文件。`, true); }; reader.readAsText(file, 'utf-8'); }
$('fileInput').addEventListener('change', (event) => { const file = event.target.files?.[0]; if (file) readFile(file); }); ['dragenter', 'dragover'].forEach((eventName) => $('dropZone').addEventListener(eventName, (event) => { event.preventDefault(); $('dropZone').classList.add('is-dragging'); })); ['dragleave', 'drop'].forEach((eventName) => $('dropZone').addEventListener(eventName, (event) => { event.preventDefault(); $('dropZone').classList.remove('is-dragging'); })); $('dropZone').addEventListener('drop', (event) => { const file = event.dataTransfer.files?.[0]; if (file) readFile(file); });

invalidateReport(); updateStatus('请粘贴或选择聊天记录；如需查看演示，请点击“载入示例”。');

// 新记录进入时清理上一份记录的自动识别结果，再重新判断双方方向。
if ($('analyzeButton')) $('analyzeButton').addEventListener('click', () => {
  if ($('textInput')?.value.trim()) prepareNewImport();
}, true);
if ($('demoButton')) $('demoButton').addEventListener('click', () => prepareNewImport(), true);
['myIdentity', 'contactIdentity'].forEach((id) => $(id)?.addEventListener('input', () => {
  const input = $(id);
  delete input.dataset.identitySource;
  delete input.dataset.identityValue;
}));
if ($('textInput')) $('textInput').addEventListener('input', () => {
  const hadReport = Boolean(latestAnalysis || currentMessages.length);
  prepareNewImport();
  if (hadReport) {
    invalidateReport();
    updateStatus('聊天记录已变更，请点击“开始观测”重新定位你与 TA。');
  }
});
