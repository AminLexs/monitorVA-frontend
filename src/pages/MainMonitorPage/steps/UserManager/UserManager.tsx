import React from "react"

import {useLocale} from "utils/localeUtils";
import SimpleSelect from "components/SimpleSelect";
import {Role} from "enums/Role";
import {getOptionsFromArrayString} from "utils/selectUtils";

const UserManager = () =>{
    const { getLocalizedString } = useLocale();
    const roles = getOptionsFromArrayString(Object.values(Role))

    return (
        <div>
            <div style={{width:"40%", marginBottom:"30px"}}>
                <label>Registration</label>
                <input placeholder={getLocalizedString('email')}/>
                <input placeholder={getLocalizedString('password')}/>
                <button className="btn">{getLocalizedString('save')}</button>
            </div>
            <table id="table" className={'centered'}>
                <thead>
                <tr>
                    <th>{getLocalizedString('userEmail')}</th>
                    <th>{getLocalizedString('changeUserRole')}</th>
                    <th>{getLocalizedString('deleteUser')}</th>
                </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            ya.eto@mail.ru
                        </td>
                        <td>
                           <SimpleSelect
                               options={roles}
                               onChange={()=>{}}
                               menuPlacement={'bottom'}
                           />
                        </td>
                        <td>
                            <button className="btn">Удалить</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

    )
}

export default UserManager