//
//  GameDetailsView.swift
//  BattleBlocksScorecard
//
//  Created by Shanaka Senevirathne on 25/12/2023.
//

import SwiftUI
import SwiftData

struct GameDetailsView: View {
    @Environment(\.modelContext) var modelContext
    
    @Bindable var game: Game
    @State private var showAddPlayersView = false
    
    init(game: Game) {
        self.game = game
    }
    
    var body: some View {
        VStack {
            Text("Selected players \(game.players.count)")
            List {
                ForEach(game.rounds) { round in
                    NavigationLink {
                        RoundDetailsView()
                    } label: {
                        Text("Round \(round.roundNumber)")
                    }
                }
                .onDelete(perform: deleteRound)
            }
            .navigationTitle($game.name)
            .navigationBarTitleDisplayMode(.inline)
            .navigationDestination(for: Round.self, destination: { round in
                Text(round.name)
            })
            .toolbar {
                Button("Add game", systemImage: "plus", action: addRound)
                Button("Add player", systemImage: "person.badge.plus", action: addPlayers)
            }
            .sheet(isPresented: $showAddPlayersView, onDismiss: addPlayersDismiss) {
                NavigationView {
                    PlayerListView(game: game)
                }
            }
            
            Button("Start Game",action: startGame)
        }
    }
    
    func addRound() {
        withAnimation {
            let newRound = Round(name: "First round", roundNumber: game.rounds.count + 1, score: 0)
            game.rounds.append(newRound)
        }
    }
    
    func addPlayers() {
        showAddPlayersView.toggle()
    }
    
    func addPlayersDismiss() {
        
    }
    
    func startGame() {
        guard game.players.count != 0 else {
            addPlayers()
            return
        }
    }
    
    func deleteRound(_ indexSet: IndexSet) {
        for index in indexSet {
            let roundToDelete = game.rounds[index]
            modelContext.delete(roundToDelete)
            
            //TODO: check if we need this or not
            do {
                try modelContext.save()
            } catch {
                print("Error while trying to delete round \(error.localizedDescription)")
            }
        }
    }
}

#Preview {
    do {
        let config = ModelConfiguration(isStoredInMemoryOnly: true)
        let container = try ModelContainer(for: Game.self, configurations: config)

        let round1 = Round(roundNumber: 1, score: 0)
        container.mainContext.insert(round1)
        
        let player1 = Player(name: "Shana")
        container.mainContext.insert(player1)
        
        let exampleGame = Game(
            name: "Sha's place",
            startTime: .now
        )
        exampleGame.rounds = [round1]
        exampleGame.players = [player1]
        
        return GameDetailsView(game: exampleGame)
            .modelContainer(container)
    } catch {
        fatalError("Failed to create model container.")
    }
}
