//
//  Contact.swift
//  getToDoList
//
//  Created by JunHwan Kim on 2021/11/18.
//

import Foundation

struct APIResponse: Codable{
    let contacts: [Contact]
}

struct Contact : Codable{
    let _id : String
    let googleLoginId : String
    let content : String
    let date : String
    let id : Int
}
