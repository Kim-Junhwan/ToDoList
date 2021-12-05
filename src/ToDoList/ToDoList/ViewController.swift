//
//  ViewController.swift
//  getToDoList
//
//  Created by JunHwan Kim on 2021/11/18.
//

import UIKit
import SnapKit
import Alamofire
import GoogleSignIn
import Firebase

class ViewController: UIViewController {
    
    var googleEmail : String = ""
    var url = "https://wm67futyr3.execute-api.us-east-1.amazonaws.com/default/todolist/"
    
    let tableView = UITableView()
    let refreshControl = UIRefreshControl()
    var dataSource : [Contact] = []

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
        self.tableView.delegate = self
        self.tableView.dataSource = self
        self.tableView.refreshControl = refreshControl
        
        let ad = UIApplication.shared.delegate as? AppDelegate
        googleEmail = (ad?.getEmail())!
        print("------------")
        print(googleEmail)
        setupUI()
        registerCell()
        fetchData(email: googleEmail)
        let longpressGesture = UILongPressGestureRecognizer(target: self, action: #selector(editData(_:)))
        
        tableView.addGestureRecognizer(longpressGesture)
        refreshControl.addTarget(self, action: #selector(pullToRefresh(_:)), for: .valueChanged)
        
    }
    
    @objc func getEmail(_ notification: Notification){
        if let text = notification.object as? String{
            googleEmail = text
        }
    }
    
    @objc func pullToRefresh(_ sender: Any) {
        print(googleEmail)
        fetchData(email: googleEmail)
        refreshControl.endRefreshing()
    }
    
    private func setupUI() {
            title = "To Do List"
            print(url)
            self.view.addSubview(tableView)
            self.tableView.translatesAutoresizingMaskIntoConstraints = false
            tableView.snp.makeConstraints { (make) in
                make.edges.equalToSuperview()
            }
        navigationItem.rightBarButtonItem = UIBarButtonItem(barButtonSystemItem: .add, target: self, action: #selector(didTapAdd))
        navigationItem.leftBarButtonItem = UIBarButtonItem(barButtonSystemItem: .cancel, target: self, action: #selector(logOut))
        }
    
    private func registerCell(){
        tableView.register(CustomCell.self, forCellReuseIdentifier: CustomCell.identifier)
    }

    
    private func fetchData(email : String){
        AF.request(URL(string: "\(url)\(googleEmail)")!).responseJSON { (response) in
            switch response.result{
            case .success(let res):
                do{
                    let jsonData = try
                    JSONSerialization.data(withJSONObject: res, options: .prettyPrinted)
                    self.dataSource = try
                    JSONDecoder().decode([Contact].self, from: jsonData)
                    DispatchQueue.main.async {
                        print(self.dataSource)
                        self.tableView.reloadData()
                    }
                }catch(let err){
                    print(err)
                }
            case .failure(let err):
                print(err)
            }
        }
    }
    
    private func postData(list : String){
        
        let param = ["content" : list, "googleLoginId":googleEmail] as Dictionary
        
        var request = URLRequest(url: URL(string: url)!)
        request.method = .post
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        do{
            try request.httpBody = JSONSerialization.data(withJSONObject: param, options: [])
        }catch (let err){
            print(err)
        }
        AF.request(request).responseString { [self] response in
            switch response.result{
            case .success:
                print("Success")
                self.fetchData(email: googleEmail)
            case .failure(let err):
                print(err)
            }
        }
    }
    
    private func putData(list : String, id : Int){
        var request = URLRequest(url: URL(string: "\(url)\(id)")!)
        let param = ["content" : list] as Dictionary
        request.method = .put
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        do{
            try request.httpBody = JSONSerialization.data(withJSONObject: param, options: [])
        }catch (let err){
            print(err)
        }
        AF.request(request).responseString { response in
            switch response.result{
            case .success:
                print("Success")
                self.fetchData(email: self.googleEmail)
            case .failure(let err):
                print(err)
            }
        }
    }
    
    private func deleteData(id : Int){
        AF.request("\(url)\(id)", method: .delete)
            .responseJSON { (response) in
                switch response.result{
                case .success(let res):
                    print("delete success")
                    self.fetchData(email: self.googleEmail)
                case .failure(let err):
                    print(err)
                }
            }
        
    }
    
    @objc private func didTapAdd(){
        let alert = UIAlertController(title: "할 일 추가", message: "Enter new to do list item", preferredStyle: .alert)
        alert.addTextField{ field in
            field.placeholder = "Enter item..."
        }
        alert.addAction(UIAlertAction(title: "취소", style: .cancel, handler: nil))
        alert.addAction(UIAlertAction(title: "추가", style: .default, handler: { [weak self](_) in
            if let field = alert.textFields?.first{
                if let text = field.text, !text.isEmpty{
                    //enter list
                    self!.postData(list: text)
                    print("fetching data")
                }
            }
        }))
        present(alert, animated: true)
    }
    
    @objc func logOut(){
        GIDSignIn.sharedInstance().signOut()
        let uvc = self.storyboard!.instantiateViewController(withIdentifier: "LoginView")
        uvc.modalPresentationStyle = .fullScreen
        uvc.modalTransitionStyle = UIModalTransitionStyle.coverVertical
        self.present(uvc, animated: true)
        print("LogOut")
    }
    
    @objc private func editData(_ longPress: UILongPressGestureRecognizer){
        let locationView = longPress.location(in: tableView)
        let indexPath = tableView.indexPathForRow(at: locationView)
        print(dataSource[indexPath![1]].id)
        let putId = self.dataSource[indexPath![1]].id
        let alert = UIAlertController(title: "수정", message: "Enter edit to do list item", preferredStyle: .alert)
        alert.addTextField{ field in
            field.placeholder = "Enter item..."
        }
        alert.addAction(UIAlertAction(title: "취소", style: .cancel, handler: nil))
        alert.addAction(UIAlertAction(title: "수정", style: .default, handler: { [weak self](_) in
            if let field = alert.textFields?.first{
                if let text = field.text, !text.isEmpty{
                    self!.putData(list: text, id: putId)
                }
            }
        }))
        present(alert, animated: true)
    }
    }

   


extension ViewController: UITableViewDelegate, UITableViewDataSource {

    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return dataSource.count
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: CustomCell.identifier) as! CustomCell
        cell.contentLabel.text = dataSource[indexPath.row].content

        return cell
    }
    
    func tableView(_ tableView: UITableView, commit editingStyle: UITableViewCell.EditingStyle, forRowAt indexPath: IndexPath) {
        if editingStyle == .delete{
            self.deleteData(id: self.dataSource[indexPath[1]].id)
        }
    }
}
