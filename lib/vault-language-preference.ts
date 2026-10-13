import {isStudyLanguage} from './study-languages';
import {isVaultLanguage,type VaultLanguage} from './object-vault-copy';

type PreferenceStorage=Pick<Storage,'getItem'|'setItem'>;
const sharedKey='german-study-language';
const vaultKey='german-vault-language';
export function readVaultLanguage(storage:PreferenceStorage):VaultLanguage{
 const shared=storage.getItem(sharedKey);
 try{
  const saved=JSON.parse(storage.getItem(vaultKey)??'null') as {language?:string;shared?:string|null}|null;
  if(saved?.language&&isVaultLanguage(saved.language)){
   if(shared&&isStudyLanguage(shared)&&shared!==saved.shared)return shared;
   return saved.language;
  }
 }catch{}
 return shared&&isVaultLanguage(shared)?shared:'tr';
}
export function saveVaultLanguage(storage:PreferenceStorage,language:VaultLanguage){
 let shared=storage.getItem(sharedKey);
 if(isStudyLanguage(language)){storage.setItem(sharedKey,language);shared=language;}
 storage.setItem(vaultKey,JSON.stringify({language,shared}));
}
