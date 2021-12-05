//
//  LoginViewController.swift
//  ToDoList
//
//  Created by JunHwan Kim on 2021/11/23.
//

import UIKit
import GoogleSignIn
import Firebase

class LoginViewController: UIViewController, GIDSignInDelegate {
    let ad = UIApplication.shared.delegate as? AppDelegate
    
    func sign(_ signIn: GIDSignIn!, didSignInFor user: GIDGoogleUser!, withError error: Error!) {
        if error == nil{
            print("loginView Email : \((user.profile.email)!)")
            ad!.googleEmail = (user.profile.email)!
            print(ad!.googleEmail)
             //로그인한 구글 이메일
            let uvc = self.storyboard!.instantiateViewController(withIdentifier: "navigation")
            uvc.modalPresentationStyle = .fullScreen
            uvc.modalTransitionStyle = UIModalTransitionStyle.coverVertical
            self.present(uvc, animated: true)
        }
    }
    
    func sign(_ signIn: GIDSignIn!, didDisconnectWith user: GIDGoogleUser!, withError error: Error!) {
        if error == nil{
            print("Disconnected \(user.profile.email)")
        }else{
            print(error)
        }
    }
    

    override func viewDidLoad() {
        super.viewDidLoad()
         //로그인 화면 불러오기
        GIDSignIn.sharedInstance()?.delegate = self
            
    }
    
   
    @IBAction func changeView(_ sender: Any?) {
        GIDSignIn.sharedInstance()?.presentingViewController = self
        GIDSignIn.sharedInstance()?.signIn()
    }
    
}
